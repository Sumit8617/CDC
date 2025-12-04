import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    );

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("ERR While Connecting to the DB", error);
  }
};
