import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongouri = process.env.MONGO_URI;
    if(!mongouri) throw new Error ("MONGO_URI is not defined");

    await mongoose.connect(mongouri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
