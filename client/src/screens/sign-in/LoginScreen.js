import { Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import React, { useEffect, useState } from 'react';
import { useAuthenticationContext } from '../../context/AuthenticationContext';
import { useNavigate } from 'react-router-dom';
import emailValidation from '../../utils/emailValidation';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoginScreen = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isButtonDisabled = email === '' || !emailValidation(email) || password === '';

  const {
    login,
    isAccountNotActivatedOnLogin,
    setIsAccountNotActivatedOnLogin,
    message,
    setMessage,
    errorMessageExists,
    setErrorMessageExists,
    isLoginLoading,
  } = useAuthenticationContext();

  const resendAccountActivationEmail = async () => {
    setIsAccountNotActivatedOnLogin(false);
    setErrorMessageExists(false);
    setMessage(false);
    try {
      await axios.get(`/api/users/resend-activation-email/${email}`);
      toast.success(`An email has been sent. Please check your emails.`);
    } catch (error) {
      toast.error(`Could not send email to ${email}`);
    }
  };

  const handleBlur = (field) => {
    if (field === 'email') {
      setEmailTouched(true);
      setEmailFocused(false);
    } else if (field === 'password') {
      setPasswordTouched(true);
      setPasswordFocused(false);
    }
  };

  const handleFocus = (field) => {
    if (field === 'email') {
      setEmailFocused(true);
    } else if (field === 'password') {
      setPasswordFocused(true);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  useEffect(() => {
    return () => {
      setIsAccountNotActivatedOnLogin(false);
    };
  }, []);

  // TODO: module.css
  return (
    <form className='authenticationContainer' onSubmit={submitHandler}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1em',
          background: 'white',
          height: 'fit-content',
          borderRadius: '1em',
          padding: '2em',
        }}
      >
        <Typography variant='body1' color='primary' sx={{ fontSize: '2rem' }}>
          Sign In
        </Typography>
        <TextField
          id='email'
          name='email'
          label='Email'
          type='email'
          value={email}
          required
          sx={{ width: '15rem' }}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id='password'
          name='password'
          label='Password'
          type={showPassword ? 'text' : 'password'}
          required
          error={passwordTouched && !passwordFocused && password.length < 8}
          helperText={passwordTouched && password.length < 8 ? 'Your password must be at least 8 characters' : ''}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ width: '15rem' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton aria-label='toggle password visibility' onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton variant='contained' type='submit' size='large' color='primary' loading={isLoginLoading} disabled={isButtonDisabled}>
          <Typography>Sign In</Typography>
        </LoadingButton>
        {/* <Typography>
          <Button onClick={() => navigate('/forgot-password')}>Forgot password?</Button>
        </Typography> */}
        {/* {successReset && <Typography className='successMessage'>{successResetMessage}</Typography>} */}

        {isAccountNotActivatedOnLogin && (
          <Typography className='errorMessage'>
            You have not activated your account. Please check your emails or click here to{' '}
            <Button onClick={resendAccountActivationEmail}>
              <Typography>resend email</Typography>
            </Button>
          </Typography>
        )}
        {errorMessageExists && <Typography className='errorMessage'>{message}</Typography>}
        <Typography
          sx={{
            fontSize: '0.8rem',
          }}
        >
          Don't have an account?{' '}
          <Button
            sx={{
              fontSize: '0.8rem',
            }}
            onClick={() => navigate('/sign-up')}
            color='primary'
          >
            Sign Up
          </Button>
        </Typography>
      </div>
    </form>
  );
};

export default LoginScreen;
