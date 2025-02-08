import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string; //importing it as a string

export const connectDB = async () => {
  try {
    console.log("MONGO_URI");
    if (mongoose.connection.readyState >= 1) return; //check for the ready state
    await mongoose.connect(MONGO_URI); //connecting to mongo uri
    console.log("Connected to db");
  } catch (error) {
    console.error("DB connection failed:", error);
  }
};
