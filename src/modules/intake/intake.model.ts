import mongoose, { Schema, Document } from "mongoose";

export interface IIntake extends Document {
  vanNo: string;
  worker: string;
  pumpName: string;
  litres: number;
  amount: number; 
  dateTime: Date;
  timestamp: Date;
}

const IntakeSchema: Schema<IIntake> = new Schema({
  vanNo: { type: String, required: true },
  worker: { type: String, required: true },
  pumpName: { type: String, required: true },
  litres: { type: Number, required: true },
  amount: { type: Number, required: true },
  dateTime: { type: Date, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Intake = mongoose.model<IIntake>("Intake", IntakeSchema);
