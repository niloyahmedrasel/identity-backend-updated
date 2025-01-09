import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


export const dbConnect = async () => {
    try {
        const uri = process.env.MONGODB_URI; 
        console.log("MongoDB URI:", process.env.MONGODB_URI);
        if (!uri) {
            throw new Error("MongoDB connection string is not defined in environment variables.");
        }
        await mongoose.connect(uri);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
};
