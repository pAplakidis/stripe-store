import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import { getUsers, registerUser, authUser, whoAmI, getUserProfile, deleteUser } from './userController.js';
const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);
router.route('/register').post(registerUser);
router.post('/login', authUser);
router.get('/who-am-i', protect, whoAmI);
router.get('/profile', protect, getUserProfile);

export default router;
