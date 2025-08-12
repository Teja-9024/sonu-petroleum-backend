import { Request, Response } from "express";
import { Van } from "./van.model";

export const createVan = async (req: Request, res: Response) => {
    try {
        const { vanNo, name,capacity } = req.body;

        const existing = await Van.findOne({ vanNo });
        if (existing) {
            return res.status(400).json({ message: 'Van with this ID already exists' });
        }

        const newVan = new Van({
            vanNo,
            name,
            capacity:capacity,
            currentDiesel: 0,
            totalFilled: 0,
            totalDelivered: 0,
            morningStock:0,
            assignedWorker: null
        });
        await newVan.save();

      const populated = await Van.findById(newVan._id)
        .populate({ path: "assignedWorker", select: "name" })
        .lean();

      res.status(201).json({
        message: 'Van created successfully',
        data: {
          ...populated,
          workerName: populated?.assignedWorker
            ? (populated.assignedWorker as any).name
            : "Not Assigned"
        }
      });
    } catch (error) {
        res.status(500).json({ message: "Error creating van", error });
    }
};

export const getVans = async (_req: Request, res: Response) => {
  try {
    const vans = await Van.find()
      .populate({ path: "assignedWorker", select: "name -_id" }) // sirf name lo
      .lean();

    const result = vans.map(v => {
      const { assignedWorker, ...rest } = v;
      return {
        ...rest,
        workerName: assignedWorker ? (assignedWorker as any).name : "Not Assigned"
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vans", error });
  }
};

