import jwt from 'jsonwebtoken';
import mongoose from 'mongoose'; // Ensure mongoose is imported

// Change the parameter type to mongoose.Types.ObjectId
const generateToken = (id: mongoose.Types.ObjectId): string => { 
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: '30d',
    });
};

export default generateToken;