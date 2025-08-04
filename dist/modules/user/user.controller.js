"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.loginUser = void 0;
const user_model_1 = require("./user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const JWT_EXPIRY = "1d";
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, env_1.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });
        // Set JWT in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.loginUser = loginUser;
const registerUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new user_model_1.User({
            email,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.registerUser = registerUser;
