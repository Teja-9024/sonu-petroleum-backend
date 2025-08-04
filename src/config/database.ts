import mongoose from "mongoose";
import { env } from "./env";

const connectToDatabase = async (): Promise<void> => {
  try {
    const dbUrl = env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error("DATABASE_URL is not defined in .env file");
    }

    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions); // Cast required to avoid TS warning

    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectToDatabase;
