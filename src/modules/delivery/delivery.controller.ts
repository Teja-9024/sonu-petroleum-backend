import { Request, Response } from "express";
import { Delivery } from "./delivery.model";
import { Van } from "../van/van.model";

export const createDelivery = async (req: Request, res: Response) => {
  try {
  //  const { user } = req;
  const data = req.body;

  const delivery = new Delivery({
    // van: user.role === 'WORKER' ? user.van : data.van,
    vanNo:data.vanNo,
    worker: data.worker,
    supplier: data.supplier,
    customer: data.customer,
    litres: data.litres,
    amount: data.amount,
    dateTime: new Date(data.dateTime || Date.now()),
  });
  await delivery.save();

  await Van.findOneAndUpdate(
    { vanNo: delivery.vanNo },
    {
      $inc: {
        currentDiesel: -delivery.litres,
        totalDelivered: delivery.litres,
      },
    }
  );

  res.json({ message: 'Delivery recorded', data: delivery });
  } catch (error) {
    res.status(500).json({ message: "Error creating delivery entry", error });
  }
};

