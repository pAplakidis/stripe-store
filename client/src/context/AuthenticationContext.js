import React, { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CircularProgress } from '@mui/material';
import Loader from '../components/Loader';

const AuthenticationContext = createContext();

export const useAuthenticationContext = () => {
  return useContext(AuthenticationContext);
};

const AuthenticationProvider = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAccountNotActivatedOnLogin, setIsAccountNotActivatedOnLogin] = useState(false);
  const [successfulSignUp, setSuccessfulSignUp] = useState(false);

  // user data
  const [accessToken, setAccessToken] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [customerId, setCustomerId] = useState(null);
  const [productsBought, setProductsBought] = useState([]);

  // stripe subscription
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [userSubscribed, setUserSubscribed] = useState(false);

  const [message, setMessage] = useState('');
  const [errorMessageExists, setErrorMessageExists] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const accessTokenFromCookies = localStorage.getItem('token');

  const setUserData = async (data) => {
    setUserId(data._id);
    setEmail(data.email);
    setFullName(data.fullName);
    setAccessToken(data.token);
    setIsAuthenticated(true);
    setIsAdmin(data.isAdmin);
    setCustomerId(data?.customerId);
    setProductsBought(data?.productsBought);

    setUserSubscribed(false);
    setUserSubscriptions([]);
  };

  const whoAmI = async (token) => {
    setIsAuthLoading(true);
    try {
      const { data } = await axios.get('/api/users/who-am-i', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      data.token = token;
      await setUserData(data);
    } catch (error) {
      logout();
      if (error.response.status === 401) {
        toast.error('Your session has expired.\nPlease log in.');
      }
    }
    setIsAuthLoading(false);
  };

  const login = async (email, password) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    setIsLoginLoading(true);

    try {
      const { data } = await axios.post(
        `/api/users/login`,
        {
          email,
          password,
        },
        headers
      );
      await setUserData(data);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error(error.response.status, error.response.data.message);
      // if (error.response.data.message.includes('not activated')) {
      //   setIsAccountNotActivatedOnLogin(true);
      //   setIsLoginLoading(false);
      //   return;
      // }
      setErrorMessageExists(true);
      setMessage(error.response.data.message);
      toast.error(message);
      setTimeout(() => {
        setErrorMessageExists(false);
        setMessage('');
      }, 5000);
      if (error.response.status === 403) {
        console.log('Cannot login');
      }
      toast.error('Cannot login');
    }
    setIsLoginLoading(false);
  };

  const saveInfoAtLocalStorage = (token) => {
    localStorage.setItem('token', token);
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserId(null);
    setIsAdmin(false);
    setAccessToken('');
  };

  const register = async (fullName, email, password) => {
    console.log('Trying to register');
    const headers = {
      'Content-Type': 'application/json',
    };
    setIsRegisterLoading(true);

    try {
      await axios.post(
        `/api/users/register`,
        {
          fullName,
          email,
          password,
        },
        headers
      );
      setFullName(fullName);
      setSuccessfulSignUp(true);
    } catch (error) {
      setErrorMessageExists(true);
      setMessage(error?.response?.data?.message || error?.message || 'Unknown Error');
      toast.error(message);
      setIsRegisterLoading(false);
      setTimeout(() => {
        setErrorMessageExists(false);
        setMessage('');
      }, 5000);
      console.error(error?.response?.status, error?.response?.data?.message);
      if (error.response.status === 403) console.log('Cannot register');
    }
    setIsRegisterLoading(false);
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  axios.defaults.baseURL = process.env.REACT_APP_BACKEND_DOMAIN;
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

  useEffect(() => {
    if (accessTokenFromCookies) {
      if (window.location.pathname === '/logout') {
        logout();
        setIsAuthLoading(false);
      } else {
        whoAmI(accessTokenFromCookies);
      }
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  if (isAuthLoading || isLoginLoading || isRegisterLoading) {
    return <Loader />;
  }

  return (
    <AuthenticationContext.Provider
      value={{
        whoAmI,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        accessToken,
        config,
        userId,
        email,
        setEmail,
        fullName,
        setFullName,
        customerId,
        productsBought,
        userSubscribed,
        userSubscriptions,
        isAccountNotActivatedOnLogin,
        setIsAccountNotActivatedOnLogin,
        successfulSignUp,
        setSuccessfulSignUp,
        message,
        setMessage,
        errorMessageExists,
        setErrorMessageExists,
        isLoginLoading,
        isRegisterLoading,
        saveInfoAtLocalStorage,
        accessTokenFromCookies,
      }}
    >
      {isAuthLoading ? <CircularProgress /> : children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
