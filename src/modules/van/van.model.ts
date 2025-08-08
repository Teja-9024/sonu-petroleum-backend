import mongoose, { Schema, Document } from "mongoose";

export interface IVan extends Document {
  vanNo: string;
  name: string;
  capacity: number;
  currentDiesel: number;
  worker: string;
  morningStock: number;
  totalFilled: number;
  totalDelivered: number;
}

const VanSchema: Schema<IVan> = new Schema({
  vanNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  capacity: { type: Number, required: true, default: 0 },
  currentDiesel: { type: Number, required: true, default: 0 },
  worker: { type: String, required: true },
  morningStock: { type: Number, required: true, default: 0 },
  totalFilled: { type: Number, required: true, default: 0 },
  totalDelivered: { type: Number, required: true, default: 0 },
});

export const Van = mongoose.model<IVan>("Van", VanSchema);
