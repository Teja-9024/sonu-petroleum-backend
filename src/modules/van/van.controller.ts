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
      .populate({ path: "assignedWorker", select: "name" }) // _id by default included
      .lean();

    const result = vans.map((v: any) => {
      const { assignedWorker, ...rest } = v;

      const workerId =
        assignedWorker
          ? (assignedWorker._id
              ? String(assignedWorker._id)               // populated object -> _id
              : (typeof assignedWorker === "string"
                  ? assignedWorker                        // already an id string
                  : assignedWorker?.toString?.() ?? null) // ObjectId -> string
            )
          : null;

      return {
        ...rest,
        assignedWorker: workerId,                              // 👉 "689c22af4c2211115a6a0bd6" | null
        workerName: assignedWorker ? assignedWorker.name : "Not Assigned",
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vans", error });
  }
};

