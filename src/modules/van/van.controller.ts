import { Request, Response } from "express";
import { Van } from "./van.model";

export const createVan = async (req: Request, res: Response) => {
    try {
        const { vanNo, name, worker,capacity } = req.body;

        const existing = await Van.findOne({ vanNo });
        if (existing) {
            return res.status(400).json({ message: 'Van with this ID already exists' });
        }

        const newVan = new Van({
            vanNo,
            name,
            worker,
            capacity:capacity,
            currentDiesel: 0,
            totalFilled: 0,
            totalDelivered: 0,
            morningStock:0
        });
        await newVan.save();

        res.status(201).json({ message: 'Van created successfully', data: newVan });
    } catch (error) {
        res.status(500).json({ message: "Error creating van", error });
    }
};

export const getVans = async (_req: Request, res: Response) => {
  try {
    const vans = await Van.find();
    res.status(200).json(vans);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vans", error });
  }
};
