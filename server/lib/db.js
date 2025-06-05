import mongoose from 'mongoose';

// Function to connect to the MongoDB database
export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', ()=> console.log('Database connected'));
        await mongoose.connect(`${process.env.MONGO_URI}/chat-app`)
    } catch (error) {
        console.log("Error in connecting to the database:", error);
        process.exit(1); // Exit the process with failure
    }
}