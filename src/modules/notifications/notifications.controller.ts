import { Response } from "express";
import { AuthedRequest } from "../../middleware/auth";
import { User } from "../user/user.model";

export const registerExpoToken = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const { token } = req.body as { token?: string };
    if (!token) return res.status(400).json({ message: "Token is required" });

    const user = await User.findById(req.user.userId);
    console.log("registerExpoToken",user,token)
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.expoPushTokens.includes(token)) {
      user.expoPushTokens.push(token);
      await user.save();
    }
    return res.json({ message: "Push token registered" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to register token" });
  }
};
