import mongoose, { Schema, Document } from "mongoose";

export interface IDelivery extends Document {
  vanNo: string;
  worker: string;
  supplier: string;
  customer: string;
  litres: number;
  amount: number;
  dateTime: Date;
  timestamp: Date;
}

const DeliverySchema: Schema<IDelivery> = new Schema({
  vanNo: { type: String, required: true },
  worker: { type: String, required: true },
  supplier: { type: String, required: true },
  customer: { type: String, required: true },
  litres: { type: Number, required: true },
  amount: { type: Number, required: true },
  dateTime: { type: Date, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Delivery = mongoose.model<IDelivery>("Delivery", DeliverySchema);
