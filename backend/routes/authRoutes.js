import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
