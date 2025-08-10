import { Request, Response } from "express";
import { Intake } from "./intake.model";
import { Van } from "../van/van.model";
import { AuthedRequest } from "../../middleware/auth";
import { User } from "../user/user.model";
import { sendExpoPush } from "../../services/push.service";

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

    const owners = await User.find({ role: "owner", expoPushTokens: { $exists: true, $ne: [] } })
      .select("expoPushTokens");
    const tokens = owners.flatMap(o => o.expoPushTokens);

    await sendExpoPush(tokens, {
      title: "New Intake Recorded",
      body: `${workerDoc!.name} filled ${litres} L in ${van.vanNo} (${pumpName})`,
      data: {
        type: "intake",
        vanNo: van.vanNo,
        litres,
        amount,
        pumpName,
        dateTime: (dateTime ? new Date(dateTime) : new Date()).toISOString(),
      },
    });

    res.json({ message: 'Intake recorded', data: intake });
  } catch (error) {
    res.status(500).json({ message: "Error creating intake entry", error });
  }
};


export const getIntakes = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let query: any = {};

    if (req.user.role === "worker") {
      if (!req.user.vanId) {
        return res.status(400).json({ message: "Worker has no van assigned" });
      }
      query.van = req.user.vanId; // ✅ sirf apni van ka data
    }
    // ✅ owner ka query empty rahega → sab vans ka data milega
    console.log("intake query: ", query)

    const intakes = await Intake.find(query)
      .populate("van", "vanNo name")     // Van info
      .populate("worker", "name email")  // Worker info
      .sort({ dateTime: -1 });            // Latest first

    return res.json({
      count: intakes.length,
      data: intakes
    });

    
  } catch (error) {
    console.error("Error fetching intakes:", error);
    return res.status(500).json({ message: "Error fetching intakes", error });
  }
};



