import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDelivery extends Document {
  van: Types.ObjectId;
  vanNo: string;
  worker: Types.ObjectId;
  workerName: string;
  supplier: string;
  customer: string;
  litres: number;
  amount: number;
  dateTime: Date;
  timestamp: Date;
}

const DeliverySchema: Schema<IDelivery> = new Schema({
  van: { type: Schema.Types.ObjectId, ref: "Van", required: true },
  vanNo: { type: String, required: true },
  worker: { type: Schema.Types.ObjectId, ref: "User", required: true },
  workerName: { type: String, required: true },
  supplier: { type: String, required: true },
  customer: { type: String, required: true },
  litres: { type: Number, required: true },
  amount: { type: Number, required: true },
  dateTime: { type: Date, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Delivery = mongoose.model<IDelivery>("Delivery", DeliverySchema);
