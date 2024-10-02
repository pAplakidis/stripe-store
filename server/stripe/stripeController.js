import stripe from '../config/stripe.js';
import { findUserByCustomerId, updateUserPriceIds } from '../user/userController.js';
import User from '../user/userModel.js';
import { createCustomer, saveCustomerId } from '../utils/stripe/utils.js';

const webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.WEBHOOK_SIGNING_SECRET);
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed':
      handleCheckoutSessionCompleted(event);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200);
};

const getUserByCustomerId = async (customerId) => {
  try {
    const user = await findUserByCustomerId(customerId);
    return [user, null];
  } catch (error) {
    console.log(error);
    return [null, error];
  }
};

const handleCheckoutSessionCompleted = async (event) => {
  const session = event.data.object;
  const customerId = event.data.object.customer;
  const [user, error] = await getUserByCustomerId(customerId);
  if (error) {
    console.log('[handleCheckoutSessionCompleted]: Could not get user by customer id');
  }

  // Retrieve the line items from the session using the Stripe API
  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items'],
    });

    const lineItems = checkoutSession.line_items.data;
    console.log(lineItems);
    if (!(lineItems && lineItems.data && lineItems.data.length > 0)) {
      console.log('No line items found');
    }
    const priceIds = lineItems.map((item) => item.price.id);

    const updatedUser = await updateUserPriceIds(user, priceIds);
    if (!updatedUser) {
      console.log('[handleCheckoutSessionCompleted]: Error updating user data');
      return;
    }
  } catch (error) {
    console.log(`[handleCheckoutSessionCompleted]: Error retrieving session or line items: ${error.message}`);
    return;
  }
};

// @desc Create checkout session for the user to pay
// @route POST /api/stripe/create-checkout-session
// @access Private
const createCheckoutSession = async (req, res) => {
  // TODO: check out metadata to pass to the webhook
  const { email, customerId, fullName } = req.user;
  const { priceIds } = req.body;
  console.log(email, fullName, customerId, priceIds);

  try {
    console.log('Checking/Creating customer ID');
    const customer = await createCustomer(customerId);
    await saveCustomerId(req.user._id, customer.id);

    console.log('Creating stripe checkout session');
    const line_items = priceIds.map((priceId) => ({
      price: priceId,
      quantity: 1,
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customer.id,
      mode: 'payment',
      line_items: line_items,
      success_url: `${process.env.STRIPE_SUCCESS_URL}`,
      cancel_url: `${process.env.STRIPE_CANCEL_URL}`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error_message: error?.message });
  }
};

export { createCheckoutSession, webhook };
