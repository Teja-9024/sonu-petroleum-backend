import express from "express";
import { createDelivery} from "./delivery.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { deliverySchema } from "./delivery.schema";

const router = express.Router();

router.post("/create-delivery", validateRequest(deliverySchema), createDelivery);

export default router;
