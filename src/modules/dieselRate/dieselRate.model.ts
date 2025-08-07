import mongoose, { Schema, Document } from "mongoose";

export interface IDieselRate extends Document {
  rate: number;
  createdAt: Date;
  updatedAt: Date;
}

const DieselRateSchema: Schema<IDieselRate> = new Schema({
  rate: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const DieselRate = mongoose.model<IDieselRate>("DieselRate", DieselRateSchema);
