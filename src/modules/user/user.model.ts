import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: "owner" | "worker";
  van?: string;
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }, 
  role: { type: String, enum: ["owner", "worker"], required: true },
  van: { 
    type: String, 
    default: null,
    required: function() { return this.role === "worker"; }
  },
  createdAt: { type: Date, default: Date.now }  
});

export const User = mongoose.model<IUser>("User", UserSchema);
