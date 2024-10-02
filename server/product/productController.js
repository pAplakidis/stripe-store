import Product from './productModel.js';

// @desc Creates a new product
// @route Post /api/products
// @access Private
const createProduct = async (req, res) => {
  const { name, price, priceId } = req.body;

  if (!name || !price || !priceId) {
    return res.status(400).json({ error_message: 'Field missing' });
  }

  let newProduct;
  try {
    newProduct = await Product.create({ name, price, priceId });
    return res.status(200).json(newProduct);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error_message: 'Error creating product' });
  }
};

// @desc Fetches all products
// @route Get /api/products
// @access Private
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error_message: 'Error fetching all products' });
  }
};

const getProductById = async (req, res) => {};

const updateProduct = async (req, res) => {};

const deleteProduct = async (req, res) => {};

export { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
