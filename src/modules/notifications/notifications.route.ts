import express from "express";
import { requireAuth } from "../../middleware/auth";
import { getMyNotifications, markAllRead, markNotificationRead, registerExpoToken } from "./notifications.controller";

const router = express.Router();

router.post("/register-token", requireAuth, registerExpoToken);
router.get("/", requireAuth, getMyNotifications);
router.post("/:id/read", requireAuth, markNotificationRead);
router.post("/read-all", requireAuth, markAllRead);

export default router;

