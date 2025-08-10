import { Response } from "express";
import { AuthedRequest } from "../../middleware/auth";
import { User } from "../user/user.model";
import mongoose from "mongoose";
import { Notification } from "./notification.model";

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


export const getMyNotifications = async (req: AuthedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const limit = Math.min(Number(req.query.limit ?? 20), 100);
  const cursor = req.query.cursor as string | undefined;

  const filter: any = { recipient: req.user.userId };
  if (cursor && mongoose.isValidObjectId(cursor)) {
    filter._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  const items = await Notification.find(filter).sort({ _id: -1 }).limit(limit).lean();
  const nextCursor = items.length === limit ? String(items[items.length - 1]._id) : null;
  return res.json({ data: items, nextCursor });
};


export const markNotificationRead = async (req: AuthedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  await Notification.updateOne(
    { _id: req.params.id, recipient: req.user.userId },
    { $set: { isRead: true } }
  );
  return res.json({ message: "Marked as read" });
};

export const markAllRead = async (req: AuthedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  await Notification.updateMany({ recipient: req.user.userId, isRead: false }, { $set: { isRead: true } });
  return res.json({ message: "All marked as read" });
};
