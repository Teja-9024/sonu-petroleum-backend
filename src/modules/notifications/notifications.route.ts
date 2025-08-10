import express from "express";
import { requireAuth } from "../../middleware/auth";
import { registerExpoToken } from "./notifications.controller";

const router = express.Router();

router.post("/register-token", requireAuth, registerExpoToken);

export default router;

