import express from "express";
import { addIntake } from "./intake.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { intakeSchema } from "./intake.schema";
import { requireAuth } from "../../middleware/auth";

const router = express.Router();

router.post("/add-intake", requireAuth, validateRequest(intakeSchema), addIntake);

export default router;

