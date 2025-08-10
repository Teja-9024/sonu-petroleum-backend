import express from "express";
import { addIntake, getIntakes } from "./intake.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { intakeSchema } from "./intake.schema";
import { requireAuth } from "../../middleware/auth";

const router = express.Router();

router.post("/add-intake", requireAuth, validateRequest(intakeSchema), addIntake);
router.get("/get-intake", requireAuth, getIntakes);

export default router;

