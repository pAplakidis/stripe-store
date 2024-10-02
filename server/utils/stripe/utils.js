import User from '../../user/userModel.js';

// create customer if needed
export const createCustomer = async (customerId) => {
  let customer = {};
  try {
    if (customerId) {
      customer.id = customerId;
    } else {
      customer = await stripe.customers.create({ email: email, name: fullName });
    }
    return customer;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error_message: 'Could not create customer', error: error });
  }
};

// update user's customer id
export const saveCustomerId = async (userId, customerId) => {
  console.log('Saving user customer ID');
  try {
    await User.findByIdAndUpdate(userId, { customerId });
  } catch (error) {
    console.log(`Error updating user: ${error}`);
    res.status(500).json({
      error_message: 'Could not add customer id to user',
      error: error,
    });
  }
};
