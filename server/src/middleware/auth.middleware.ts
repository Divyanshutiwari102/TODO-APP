import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.model';
import { CustomError } from './error-handler';

export interface AuthRequest extends Request {
    user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Check for "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return next(new CustomError('User not found (Token invalid)', 401));
            }
            
            req.user = user;
            next(); // Proceed to route handler
        } catch (error) {
            return next(new CustomError('Not authorized, token failed', 401));
        }
    }

    if (!token) {
        return next(new CustomError('Not authorized, no token', 401));
    }
};