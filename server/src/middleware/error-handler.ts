import { Request, Response, NextFunction } from 'express';
import ErrorLog from '../models/ErrorLog.model';

export class CustomError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err instanceof CustomError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    // 1. Log the error to MongoDB (MANDATORY REQUIREMENT)
    const errorLog = new ErrorLog({
        method: req.method,
        url: req.originalUrl,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? 'Stack trace hidden' : err.stack,
        body: req.body,
    });

    errorLog.save().catch(dbErr => {
        console.error('Failed to save error log to DB:', dbErr);
    });

    // 2. Send the standardized error response
    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {} 
    });
};