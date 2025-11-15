import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './utils/db';
import { errorHandler, CustomError } from './middleware/error-handler';
import userRouter from './routes/user.routes';
import todoRouter from './routes/todo.routes';
// Add this import to the top of user.controller.ts


// Load environment variables
dotenv.config({ path: '../.env' }); 

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:5001', // <-- USE THE CURRENT FRONTEND PORT
    credentials: true,
}));
app.use(express.json()); // Body parser

// ROUTES
app.use('/api/users', userRouter); 
app.use('/api/todos', todoRouter); 

// Fallback for unhandled routes (Will use the errorHandler)
app.use((req, res, next) => {
    next(new CustomError(`Not Found - ${req.originalUrl}`, 404));
});

// Use the error handling middleware (MUST be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});