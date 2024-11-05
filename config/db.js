import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
    try {
        const res = await mongoose.connect(process.env.MONGO_URI);
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
