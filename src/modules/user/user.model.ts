import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: "owner" | "worker";
  van?: Types.ObjectId | null;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }, 
  role: { type: String, enum: ["owner", "worker"], required: true },
  van: {
      type: Schema.Types.ObjectId,
      ref: "Van",
      default: null,
      required: function (this: IUser) {
        return this.role === "worker";
      },
    },
  createdAt: { type: Date, default: Date.now }  
});

UserSchema.index({ role: 1, van: 1 }, { unique: true, partialFilterExpression: { role: "worker", van: { $type: "objectId" } } });

export const User = mongoose.model<IUser>("User", UserSchema);
