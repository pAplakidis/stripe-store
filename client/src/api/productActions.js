import axios from 'axios';

export const createProductAction = async (name, price, priceId) => {
  try {
    const { data } = axios.post('/api/products', { name, price, priceId });
    return [data, null];
  } catch (error) {
    console.log('[createProductAction]:', error);
    return [null, error];
  }
};

export const getProductsAction = async () => {
  try {
    const { data } = await axios.get('/api/products');
    return [data, null];
  } catch (error) {
    console.log('[createProductAction]:', error);
    return [null, error];
  }
};
