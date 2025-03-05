import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URI) {
    return console.error("MISSING MONGODB_URI");
  }
  if (isConnected) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "test" });
    isConnected = true;
    console.info("MongoDB is connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    throw error;
  }
};
