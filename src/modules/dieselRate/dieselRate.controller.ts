import { Request, Response } from "express";
import { DieselRate } from "./dieselRate.model";

export const addOrUpdateDieselRate = async (req: Request, res: Response) => {
  const { rate } = req.body;

  try {
    let existing = await DieselRate.findOne();
    if (existing) {
      existing.rate = rate;
      existing.updatedAt = new Date();
      await existing.save();

      return res.status(200).json({
        message: "Diesel rate updated successfully",
        rate: existing
      });
    }

    const newRate = new DieselRate({
      rate,
    });

    await newRate.save();

    return res.status(201).json({
      message: "Diesel rate added successfully",
      rate: newRate
    });
  } catch (error) {
    console.error("Error updating rate:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDieselRate = async (_req: Request, res: Response) => {
  try {
    const latestRate = await DieselRate.findOne().sort({ updatedAt: -1 });
    if (!latestRate) {
      return res.status(404).json({ message: "No diesel rate found" });
    }
    return res.status(200).json({ rate: latestRate.rate, updatedAt: latestRate.updatedAt });
  } catch (error) {
    console.error("Error fetching rate:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
