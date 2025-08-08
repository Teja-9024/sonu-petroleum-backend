import { Request, Response } from "express";
import { Intake } from "./intake.model";
import { Van } from "../van/van.model";
import { AuthedRequest } from "../../middleware/auth";
import { User } from "../user/user.model";

export const addIntake = async (req: AuthedRequest, res: Response) => {
  try {
    // const { user } = req;
     const { user } = req;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const { pumpName, litres, amount, dateTime, vanNo: bodyVanNo } = req.body;
    let van = null;
    let workerDoc = await User.findById(user.userId);

    if (user.role === "worker") {
      if (!user.vanId) return res.status(400).json({ message: "Worker has no van assigned" });
      van = await Van.findById(user.vanId);
      if (!van) return res.status(400).json({ message: "Assigned van not found" });
    } else {
      // owner must pass vanNo
      if (!bodyVanNo) return res.status(400).json({ message: "vanNo is required for owner" });
      van = await Van.findOne({ vanNo: bodyVanNo });
      if (!van) return res.status(400).json({ message: "Van not found" });
    }

    const intake = new Intake({
      van: van._id,
      vanNo: van.vanNo,
      worker: workerDoc!._id,
      workerName: workerDoc!.name,
      pumpName,
      litres,
      amount,
      dateTime: dateTime ? new Date(dateTime) : new Date()
    });
    await intake.save();

    await Van.updateOne(
      { _id: van._id },
      { $inc: { currentDiesel: litres, totalFilled: litres } }
    );  

    res.json({ message: 'Intake recorded', data: intake });
  } catch (error) {
    res.status(500).json({ message: "Error creating intake entry", error });
  }
};


