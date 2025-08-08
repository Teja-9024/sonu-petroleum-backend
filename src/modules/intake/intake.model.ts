import mongoose, { Schema, Document, Types } from "mongoose";

export interface IIntake extends Document {
  van: Types.ObjectId;
  vanNo: string;
  worker: Types.ObjectId;
  workerName: string; 
  pumpName: string;
  litres: number;
  amount: number; 
  dateTime: Date;
  timestamp: Date;
}

const IntakeSchema: Schema<IIntake> = new Schema({
  van: { type: Schema.Types.ObjectId, ref: "Van", required: true },
  vanNo: { type: String, required: true },
  worker: { type: Schema.Types.ObjectId, ref: "User", required: true },
  workerName: { type: String, required: true },
  pumpName: { type: String, required: true },
  litres: { type: Number, required: true },
  amount: { type: Number, required: true },
  dateTime: { type: Date, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Intake = mongoose.model<IIntake>("Intake", IntakeSchema);

