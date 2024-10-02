import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongo-db.js';

import userRoutes from './user/userRoutes.js';
import stripeRoutes from './stripe/stripeRoutes.js';
import productRoutes from './product/productRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

app.use(cors({ origin: true }));

app.use('/api/users', userRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
