import dotenv from "dotenv";
import { z } from "zod";

dotenv.config(); // Load from .env

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  DATABASE_URL: z.string().url("Invalid DATABASE_URL"),
});

export const env = envSchema.parse(process.env);
