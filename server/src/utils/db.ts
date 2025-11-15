import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            // Throw error if URI is missing
            throw new Error("MONGO_URI is not defined in environment variables.");
        }
        
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        // Exit process with failure
        process.exit(1); 
    }
};

export default connectDB;