import express from "express";
import { createDelivery} from "./delivery.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { deliverySchema } from "./delivery.schema";
import { requireAuth } from "../../middleware/auth";

const router = express.Router();

router.post("/create-delivery", requireAuth, validateRequest(deliverySchema), createDelivery);

export default router;
