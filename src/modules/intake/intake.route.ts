import express from "express";
import { addIntake } from "./intake.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { intakeSchema } from "./intake.schema";

const router = express.Router();

router.post("/add-intake", validateRequest(intakeSchema), addIntake);
// router.get("/", getIntakes);
// router.get("/:id", getIntakeById);
// router.put("/:id", validateRequest(intakeSchema), updateIntake);
// router.delete("/:id", deleteIntake);

export default router;
