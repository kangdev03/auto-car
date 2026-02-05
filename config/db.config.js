import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const mongouri = process.env.MONGO_URI;
    if(!mongouri) {
      console.error("MONGO_URI is not defined");
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(mongouri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
