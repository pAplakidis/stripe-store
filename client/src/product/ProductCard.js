import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { useAuthenticationContext } from '../context/AuthenticationContext';
import { Button, Typography } from '@mui/material';

const ProductCard = ({ product, cartProducts, addProductToCart, removeProductFromCart }) => {
  const { productsBought } = useAuthenticationContext();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className='group max-w-60 hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full'>
      <div className='relative w-full overflow-hidden rounded-md'>
        <img />
      </div>
      <div className='flex flex-col pt-2'>
        <div className='text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2 text-left'>{product.name}</div>
        <div className='my-3 flex items-center gap-x-2 text-sm md:text-sm'>
          <div className='w-full flex justify-between items-center gap-x-1 text-slate-500'>
            <Typography>{product.price}$</Typography>
            {productsBought.includes(product.priceId) ? (
              <Button variant='outlined'>Paid</Button>
            ) : cartProducts.includes(product) ? (
              <Button onClick={() => removeProductFromCart(product)}>Remove from cart</Button>
            ) : (
              <LoadingButton loading={isLoading} variant='contained' onClick={() => addProductToCart(product)}>
                Add to Cart
              </LoadingButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
