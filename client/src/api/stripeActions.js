import axios from 'axios';

export const checkoutAction = async (priceIds) => {
  try {
    const { data } = await axios.post(`/api/stripe/create-checkout-session`, { priceIds });
    return [data, null];
  } catch (error) {
    console.log('[checkoutAction]:', error);
    return [null, error];
  }
};
