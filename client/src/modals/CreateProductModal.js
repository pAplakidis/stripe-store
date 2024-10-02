import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button, Modal, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';

import Loader from '../components/Loader';
import classes from './CreateProductModal.module.css';
import { createProductAction } from '../api/productActions';

const CreateProductModal = ({ isModalOpen, setIsModalOpen, fetchProducts }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [priceId, setPriceId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const [data, error] = await createProductAction(name, price, priceId);
    if (error) {
      toast.error('Error creating new product');
    }

    setIsLoading(false);
    fetchProducts();
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <div className={classes.modalContainer}>
          <div className={classes.modalPlacementContainer}>
            <div className={classes.modalItemsContainer}>
              <div className='flex justify-end'>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  <CloseIcon className='cursor-pointer' />
                </Button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className={classes.modalformcontainer}>
                  <Typography variant='h4' className='my-4'>
                    Create Product
                  </Typography>

                  <TextField
                    type='text'
                    required
                    label='Product Name'
                    className='my-4'
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />

                  <NumberInput aria-label='Price' placeholder='Price' value={price} onChange={(event, val) => setPrice(val)} />

                  <TextField
                    type='text'
                    required
                    label='Price ID'
                    className='my-4'
                    value={priceId}
                    onChange={(e) => {
                      setPriceId(e.target.value);
                    }}
                  />

                  {/* TODO: price + priceId */}

                  <div className='flex justify-center'>
                    <Button variant='contained' type='submit'>
                      Submit
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateProductModal;
