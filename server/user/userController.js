import asyncHandler from 'express-async-handler';

import User from './userModel.js';
// import emailValidation from '../utils/emailValidation.js';
import ActivateAccountToken from './ActivateAccountTokenModel.js';
import generateToken from '../utils/generateToken.js';
// import { sendActivationEmail } from '../utils/emails.js';

// @desc Get all users
// @route GET /api/users/
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error fetching users!' });
  }
});

// @desc Get user by id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found!');
  }
});

const findUserByCustomerId = async (customerId) => {
  console.log(`DEV: Initializing findUserByCustomerId with customerId: ${customerId}`);
  let user;
  try {
    user = await User.findOne({ customerId });
  } catch (error) {
    console.log(`DEV: Something went wrong with MongoDb in finding user by customer id ${customerId}`);
    console.log(error);
    throw new Error(`Something went wrong with MongoDb in finding user by customer id ${customerId}`);
  }
  if (!user) {
    console.log(`DEV: Could not fine user with customerId: ${customerId}`);
    throw new Error(`Could not fine user with customerId: ${customerId}`);
  }
  console.log(`DEV: Found user with customerId: ${customerId}`);
  return user;
};

// @desc Delete a user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    console.log(`User ${req.params.id} not found`);
    throw new Error('user not found');
  }
});

// delete user (for cleanup after tests)
const deleteUserInternal = async (email) => {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      await User.deleteOne({ _id: user._id });
      console.log(`User ${user.email} removed`);
    } else {
      throw new Error('user not found');
    }
  } catch (error) {
    console.log(`Error removing user ${email}`);
    console.log(error);
  }
};

// @desc Register user
// @route GET /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, fullName, password } = req.body;
  let newUser;

  if (!fullName || !email || !password) {
    res.status(500).json({ message: 'Insufficient data for registration' });
    return;
  }

  // if (!emailValidation(email)) {
  //   res.status(400).json({ message: 'Invalid user email' });
  //   return;
  // }

  let userExistsByEmail;
  try {
    userExistsByEmail = await User.findOne({ email: email });
  } catch (error) {
    res.status(500).json({ message: 'Error accessing users' });
  }
  if (userExistsByEmail) {
    res.status(400).json({ message: `User with email: ${email} already exists` });
    return;
  }

  try {
    newUser = await User.create({
      email,
      fullName,
      password,
    });
  } catch (error) {
    console.log('Could not create user');
    console.log(error);
    res.status(500).json({ message: 'Could not create user' });
    return;
  }

  if (!newUser) {
    res.status(500).json({ message: 'Could not create user' });
    return;
  }

  try {
    const newActivateAccountToken = await ActivateAccountToken.create({
      userId: newUser._id,
    });
    console.log(newUser);
    console.log(newActivateAccountToken._id);
    res.status(201).json(newActivateAccountToken);
    // sendActivationEmail(newUser.email, newActivateAccountToken._id);
  } catch (error) {
    console.log('Could not create AA token');
    console.log(error);
    res.status(500).json({ message: 'Could not create AA token' });
  }
  return;
});

// @desc Auth user & get token
// @route Post /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(500).json({ message: 'Insufficient data for authentication' });
    return;
  }

  const user = await User.findOne({ email: email });
  if (user) {
    if (await user.matchPassword(password)) {
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        customerId: user?.customerId,
      });
    } else {
      res.status(401).json({ message: 'Wrong credentials!' });
    }
  } else {
    res.status(401).json({ message: 'Wrong credentials!' });
  }
  return;
});

// @desc Token validation for user
// @route Get /api/users/who-am-i
// @access Public
const whoAmI = asyncHandler(async (req, res) => {
  try {
    // FIXME: do not return password and keys
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// @desc Get user profile
// @route Get /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
    });
  } else {
    res.status(404).json({ error_message: 'User not found!' });
    throw new Error('user not found!');
  }
});

const updateUserPriceIds = async (user, priceIds) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: {
          productsBought: { $each: priceIds },
        },
      },
      { new: true }
    );

    console.log(updatedUser);
    return updatedUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export {
  getUsers,
  getUserById,
  findUserByCustomerId,
  deleteUser,
  deleteUserInternal,
  registerUser,
  authUser,
  whoAmI,
  getUserProfile,
  updateUserPriceIds,
};
