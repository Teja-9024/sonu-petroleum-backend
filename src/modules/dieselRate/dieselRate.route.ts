import express from "express";
import { addOrUpdateDieselRate, getDieselRate } from "./dieselRate.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { dieselRateSchema } from "./dieselRate.schema";

const router = express.Router();

router.post("/set-diesel-rate", validateRequest(dieselRateSchema), addOrUpdateDieselRate)
router.get("/get-diesel-rate", getDieselRate)

export default router;