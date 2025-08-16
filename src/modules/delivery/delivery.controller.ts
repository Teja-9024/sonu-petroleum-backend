import { Request, Response } from "express";
import { Delivery } from "./delivery.model";
import { Van } from "../van/van.model";
import { AuthedRequest } from "../../middleware/auth";
import { User } from "../user/user.model";
import { sendExpoPush } from "../../services/push.service";
import { createOwnerNotifications } from "../notifications/notification.service";

export const createDelivery = async (req: AuthedRequest, res: Response) => {
  try {
    const { user } = req;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { supplier, customer, litres, amount, dateTime, vanNo: bodyVanNo } = req.body;

    let van = null;
    let workerDoc = await User.findById(user.userId);

    console.log("user.role:", user.role)
    if (user.role === "worker") {
      if (!user.vanId) return res.status(400).json({ message: "Worker has no van assigned" });
      van = await Van.findById(user.vanId);
      if (!van) return res.status(400).json({ message: "Assigned van not found" });
    } else {
      if (!bodyVanNo) return res.status(400).json({ message: "vanNo is required for owner" });
      van = await Van.findOne({ vanNo: bodyVanNo });
      if (!van) return res.status(400).json({ message: "Van not found" });
    }
  
    const litresNum = Number(litres);
    const updatedVan = await Van.findOneAndUpdate(
      { _id: van._id, currentDiesel: { $gte: litresNum } },           // guard
      { $inc: { currentDiesel: -litresNum, totalDelivered: litresNum } }, // atomic
      { new: true }
    );

    if (!updatedVan) {
      // Guard failed → jitna available hai, woh bata do
      const fresh = await Van.findById(van._id).select("currentDiesel").lean();
      return res.status(500).json({
        message: `Not enough diesel in van. Available: ${fresh?.currentDiesel ?? 0} L`
      });
    }

  const delivery = new Delivery({
    van: updatedVan._id,
    vanNo: updatedVan.vanNo,
    worker: workerDoc!._id,
    workerName: workerDoc!.name,
    supplier,
    customer,
    litres,
    amount,
    dateTime: dateTime ? new Date(dateTime) : new Date()
  });
  await delivery.save();

  // await Van.updateOne(
  //   { _id: van._id },
  //   { $inc: { currentDiesel: -litres, totalDelivered: litres } }
  // );


    await createOwnerNotifications({
      title: "New Delivery Recorded",
      body: `${workerDoc?.name ?? "Worker"} delivered ${litres} L from ${van.vanNo} to ${customer}`,
      data: {
        type: "delivery",
        vanNo: van.vanNo,
        litres,
        amount,
        supplier,
        customer,
        dateTime: (dateTime ? new Date(dateTime) : new Date()).toISOString(),
      }
    });

    const owners = await User.find({
      role: "owner",
      expoPushTokens: { $exists: true, $ne: [] }
    }).select("expoPushTokens");

    const tokens = owners.flatMap(o => o.expoPushTokens);
    if (tokens.length) {
      await sendExpoPush(tokens, {
        title: "New Delivery Recorded",
        body: `${workerDoc?.name ?? "Worker"} delivered ${litres} L from ${van.vanNo} to ${customer}`,
        data: {
          type: "delivery",
          vanNo: van.vanNo,
          litres,
          amount,
          supplier,
          customer,
          dateTime: (dateTime ? new Date(dateTime) : new Date()).toISOString(),
        },
      });
    }

  res.json({ message: 'Delivery recorded', data: delivery });
  } catch (error) {
    res.status(500).json({ message: "Error creating delivery entry", error });
  }
};


export const getDeliveries = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const query: any = {};

    // Worker → sirf apni van
    if (req.user.role === "worker") {
      if (!req.user.vanId) {
        return res.status(400).json({ message: "Worker has no van assigned" });
      }
      query.van = req.user.vanId;
    }
    // Owner → query empty => sab vans ki deliveries
   console.log("req.user.role",query)
    const deliveries = await Delivery.find(query)
      .populate("van", "vanNo name")       // van info
      .populate("worker", "name email")    // worker info
      .sort({ dateTime: -1 });             // latest first

    return res.json({
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return res.status(500).json({ message: "Error fetching deliveries", error });
  }
};

