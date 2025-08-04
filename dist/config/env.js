"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config(); // Load from .env
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.string().default("3000"),
    JWT_SECRET: zod_1.z.string().min(1, "JWT_SECRET is required"),
    DATABASE_URL: zod_1.z.string().url("Invalid DATABASE_URL"),
});
exports.env = envSchema.parse(process.env);
