import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    priceId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('product', productSchema);
export default Product;
