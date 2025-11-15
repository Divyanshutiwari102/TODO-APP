import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import generateToken from '../utils/generateToken';
import { CustomError } from '../middleware/error-handler';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose'; // Essential for type assertion

// Helper to simulate email sending for Forgot Password
const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email", 
        port: 587,
        secure: false, 
        auth: {
            user: process.env.ETHEREAL_USER, // From .env
            pass: process.env.ETHEREAL_PASS, // From .env
        },
    });

    const mailOptions = {
        from: 'no-reply@intellisqr.com',
        to: email,
        subject: 'Password Reset Request',
        text: `Please use this link to reset your password:\n\n${resetUrl}\n\n`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password Reset Email Sent! Preview URL (TESTING ONLY):", nodemailer.getTestMessageUrl(info));
};


// @route POST /api/users/signup
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(new CustomError('User already exists', 400)); 
        }

        const user = await User.create({ email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                email: user.email,
                // FIX APPLIED: Casts through 'unknown' to match generateToken signature
                token: generateToken(user._id as unknown as mongoose.Types.ObjectId), 
            });
        }else {
            next(new CustomError('Invalid user data', 400));
        }
    } catch (error) {
        next(error); 
    }
};

// @route POST /api/users/login
export const authUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && await user.matchPassword(password)) {
            res.json({
                _id: user._id,
                email: user.email,
                // FIX APPLIED: Casts through 'unknown' to match generateToken signature
                token: generateToken(user._id as unknown as mongoose.Types.ObjectId),
            });
        } else {
            next(new CustomError('Invalid email or password', 401));
        }
    } catch (error) {
        next(error);
    }
};

// @route POST /api/users/forgot-password (MANDATORY REQUIREMENT)
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // Send 200 even if user not found to avoid leaking info
            return res.status(200).json({ success: true, message: 'If user exists, password reset link has been sent.' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour

        await user.save({ validateBeforeSave: false });

        // Frontend path for reset (Must match your frontend URL structure)
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        
        await sendPasswordResetEmail(user.email, resetUrl);
        
        res.status(200).json({ success: true, message: 'Password reset link sent to email (check console for test URL).' });

    } catch (error) {
        next(error);
    }
};

// @route PUT /api/users/reset-password/:token (MANDATORY REQUIREMENT)
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }, 
        });

        if (!user) {
            return next(new CustomError('Invalid or expired reset token', 400));
        }
        if (!req.body.password) {
            return next(new CustomError('New password is required', 400));
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        
        await user.save(); 

        res.status(200).json({ success: true, message: 'Password reset successful. Please login.' });

    } catch (error) {
        next(error);
    }
};