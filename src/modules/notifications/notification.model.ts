import mongoose, { Schema, Document, Types } from "mongoose";

export interface INotification extends Document {
  recipient: Types.ObjectId; // User
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
