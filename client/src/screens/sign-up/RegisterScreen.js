import React, { useState, useEffect } from 'react';

import { useAuthenticationContext } from '../../context/AuthenticationContext';

import Typography from '@mui/material/Typography';
import { IconButton, TextField, Grid, InputAdornment, Button as MuiButton, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useNavigate } from 'react-router-dom';
import emailValidation from '../../utils/emailValidation';

const RegisterScreen = ({}) => {
  const navigate = useNavigate();
  const { register, successfulSignUp, setSuccessfulSignUp, message, errorMessageExists, isRegisterLoading } = useAuthenticationContext();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [firstNameTouched, setFullNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [firstNameFocused, setFullNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleBlur = (field) => {
    if (field === 'fullName') {
      setFullNameTouched(true);
      setFullNameFocused(false);
    } else if (field === 'email') {
      setEmailTouched(true);
      setEmailFocused(false);
    } else if (field === 'password') {
      setPasswordTouched(true);
      setPasswordFocused(false);
    }
  };

  const handleFocus = (field) => {
    if (field === 'fullName') {
      setFullNameFocused(true);
    } else if (field === 'email') {
      setEmailFocused(true);
    } else if (field === 'password') {
      setPasswordFocused(true);
    }
  };

  const isButtonDisabled = fullName === '' || email === '' || !emailValidation(email) || password.length < 8;

  const submitHandler = async (e) => {
    e.preventDefault();
    register(fullName, email, password);
  };

  // TODO: module.css
  return (
    <>
      {successfulSignUp ? (
        <div style={{ background: 'white' }}>
          <Grid container flexDirection='column' alignContent='center' gap='1rem'>
            <Grid item textAlign='center'>
              <Typography variant='body1' color='primary' className={'PoppinsRegular'} sx={{ fontSize: '2rem' }}>
                Success
              </Typography>
            </Grid>

            <Grid item textAlign='center'>
              <div style={{ fontSize: '1em' }}>
                An activation email has been sent to
                <br />
                <Typography variant='body1' color='primary' className={'PoppinsRegular'} sx={{ fontSize: '1em' }}>
                  {email}
                </Typography>
                <br />
                Locate and use the enclosed link to activate your account.
              </div>
            </Grid>
            <Grid item alignSelf='center' marginY='2em'>
              <Button
                variant='contained'
                size='large'
                onClick={() => {
                  setSuccessfulSignUp(false);
                  navigate('/sign-in');
                }}
              >
                OK
              </Button>
            </Grid>
          </Grid>
        </div>
      ) : (
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
              Sign Up
            </Typography>
            <TextField
              id='fullName'
              name='fullName'
              label='Full Name'
              type='name'
              value={fullName}
              required
              sx={{ width: '15rem' }}
              onChange={(e) => setFullName(e.target.value)}
              onFocus={() => handleFocus('fullName')}
              onBlur={() => handleBlur('fullName')}
              error={firstNameFocused && !firstNameFocused && fullName === ''}
              helperText={firstNameTouched && !firstNameTouched && fullName === '' ? 'Please enter a first name' : ''}
            />
            <TextField
              id='email'
              name='email'
              label='Email'
              type='email'
              value={email}
              required
              sx={{ width: '15rem' }}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => handleFocus('email')}
              onBlur={() => handleBlur('email')}
              error={emailTouched && !emailFocused && emailValidation(email) === false}
              helperText={emailTouched && !emailFocused ? 'Please enter a valid email' : ''}
            />
            <TextField
              id='password'
              name='password'
              label='Password'
              type={showPassword ? 'text' : 'password'}
              required
              sx={{ width: '15rem' }}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              error={passwordTouched && !passwordFocused && password.length < 8}
              helperText={passwordTouched && password.length < 8 ? 'Your password must be at least 8 characters' : ''}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {errorMessageExists && <Typography className='errorMessage'>{message}</Typography>}
            {/* TODO: add privacy policy link */}
            <Typography>By Signing Up you agree to our privacy policy.</Typography>
            <LoadingButton variant='contained' type='submit' size='large' color='primary' disabled={isButtonDisabled} loading={isRegisterLoading}>
              <Typography>Sign Up</Typography>
            </LoadingButton>
            <Typography
              sx={{
                fontSize: '0.8rem',
              }}
            >
              Already have an account?{' '}
              <Button onClick={() => navigate('/sign-in')} color='primary'>
                Sign In
              </Button>
            </Typography>
          </div>
        </form>
      )}
    </>
  );
};

export default RegisterScreen;
