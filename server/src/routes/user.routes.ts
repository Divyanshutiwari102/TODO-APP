import express from 'express';
import { registerUser, authUser, forgotPassword, resetPassword } from '../controllers/user.controller';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword); // Forgot Password
router.put('/reset-password/:token', resetPassword); // Reset Password

export default router;