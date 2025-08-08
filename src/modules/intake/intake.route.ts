import express from "express";
import { addIntake } from "./intake.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { intakeSchema } from "./intake.schema";

const router = express.Router();

router.post("/add-intake", validateRequest(intakeSchema), addIntake);

export default router;
