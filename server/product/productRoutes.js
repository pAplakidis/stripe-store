import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from './productController.js';

const router = express.Router();

router.route('/').get(protect, getProducts).post(protect, createProduct);
router.route('/:id').get(protect, getProductById).put(protect, updateProduct).delete(protect, deleteProduct);

export default router;
