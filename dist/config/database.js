"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectToDatabase = async () => {
    try {
        const dbUrl = env_1.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error("DATABASE_URL is not defined in .env file");
        }
        await mongoose_1.default.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }); // Cast required to avoid TS warning
        console.log("Connected to MongoDB successfully");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};
exports.default = connectToDatabase;
