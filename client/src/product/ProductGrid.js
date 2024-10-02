import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import toast from 'react-hot-toast';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CreateProductModal from '../modals/CreateProductModal';
import { getProductsAction } from '../api/productActions';
import Loader from '../components/Loader';
import { checkoutAction } from '../api/stripeActions';

const ProductGrid = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addProduct = () => {
    setIsModalOpen(true);
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    const [data, error] = await getProductsAction();
    if (error) {
      toast.error('Error fetching products');
      setIsLoading(false);
      return;
    }

    setProducts(data);
    setIsLoading(false);
  };

  const addProductToCart = (product) => {
    setCartProducts([...cartProducts, product]);
  };

  const removeProductFromCart = (product) => {
    setCartProducts(cartProducts.filter((cartProduct) => cartProduct.id !== product.id));
  };

  const checkout = async () => {
    setIsLoading(true);
    const priceIds = cartProducts.map((prod) => prod.priceId);
    const [data, error] = await checkoutAction(priceIds);
    if (error) {
      toast.error('Error buying product');
      setIsLoading(false);
      return;
    }

    window.location = data.url;
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className='w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-3'>
        {products.map((product, index) => (
          <ProductCard
            product={product}
            cartProducts={cartProducts}
            addProductToCart={addProductToCart}
            removeProductFromCart={removeProductFromCart}
            key={index}
          />
        ))}
      </div>
      <div className='flex gap-2'>
        <Button variant='outlined' onClick={addProduct}>
          Add product
        </Button>
        <LoadingButton disabled={!cartProducts.length} variant='contained' onClick={checkout}>
          Checkout
        </LoadingButton>
      </div>
      <CreateProductModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} fetchProducts={fetchProducts} />
    </>
  );
};

export default ProductGrid;
