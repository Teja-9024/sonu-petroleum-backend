import { Request, Response } from "express";
import { User } from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { Van } from "../van/van.model";
import mongoose from "mongoose";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate("van", "vanNo");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate tokens
    const payload = { 
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      vanId: user.van ? (user.van as any)._id?.toString?.() ?? user.van?.toString?.() ?? null : null 
    };
    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production", // HTTPS only in prod
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      tokens: {
        accessToken,
        refreshToken
      },
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name :user.name,
        vanNo: (user.van as any)?.vanNo ?? null,
        createdAt: user.createdAt,
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, role, name, vanNo } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (role === "owner") {
      const existingOwner = await User.findOne({ role: "owner" });
      if (existingOwner) {
        return res.status(400).json({ message: "Owner already registered" });
      }
    }

    let van = null;
    if (role === "worker") {
      if (!vanNo) return res.status(400).json({ message: "vanNo is required for worker" });

      van = await Van.findOne({ vanNo });
      if (!van) return res.status(400).json({ message: "Van not found. Create van before registering worker." });

      if (van.assignedWorker) {
        return res.status(400).json({ message: "This van already has a worker assigned" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
      name,
      van:van?._id ?? null
    }); 

    await newUser.save();

    if (role === "worker" && van) {
      van.assignedWorker = newUser._id as mongoose.Types.ObjectId;
      await van.save();
    }

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        name :newUser.name,
        vanNo: van?.vanNo ?? null,
        createdAt: newUser.createdAt
      } 
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshAccessToken = (req: Request, res: Response) => {
  const {token} = req.body;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return res.status(200).json({
      accessToken: newAccessToken
    });

  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};


