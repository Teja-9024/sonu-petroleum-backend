import { Request, Response } from "express";
import { Intake } from "./intake.model";
import { Van } from "../van/van.model";

export const addIntake = async (req: Request, res: Response) => {
  try {
    // const { user } = req;
    const data = req.body;

    const intake = new Intake({
      // van: user.role === 'WORKER' ? user.van : data.van,
      vanNo: data.vanNo,
      worker: data.worker,
      pumpName: data.pumpName,
      litres: data.litres,
      amount: data.amount,
      dateTime: new Date(data.dateTime || Date.now()),
    });
    await intake.save();

    await Van.findOneAndUpdate(
      { vanNo: intake.vanNo },
      {
        $inc: {
          currentDiesel: intake.litres,
          totalFilled: intake.litres,
        },
      }
    );

    res.json({ message: 'Intake recorded', data: intake });
  } catch (error) {
    res.status(500).json({ message: "Error creating intake entry", error });
  }
};

