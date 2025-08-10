import express from "express";
import { createDelivery, getDeliveries} from "./delivery.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { deliverySchema } from "./delivery.schema";
import { requireAuth } from "../../middleware/auth";

const router = express.Router();

router.post("/create-delivery", requireAuth, validateRequest(deliverySchema), createDelivery);
router.get("/get-delivery", requireAuth, getDeliveries);

export default router;
