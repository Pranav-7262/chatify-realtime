import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // Keep this informational in development only
    if (process.env.NODE_ENV !== "production") {
      console.info(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
