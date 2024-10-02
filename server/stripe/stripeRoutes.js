import express from 'express';
import { createCheckoutSession, webhook } from './stripeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/webhook').post(webhook);
router.route('/create-checkout-session').post(protect, createCheckoutSession);

export default router;
