import React from 'react';
import { ClipLoader } from 'react-spinners';
import classes from './Loader.module.css';

const Loader = ({ colorOfLoader = '##2A979C' }) => {
  return (
    <div className={classes.Loader}>
      <ClipLoader size={50} color={colorOfLoader} />
    </div>
  );
};

export default Loader;
