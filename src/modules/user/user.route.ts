import express from "express";
import { loginUser, registerUser,refreshAccessToken } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { loginSchema } from "./user.schema";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), loginUser)
router.post("/register", validateRequest(loginSchema), registerUser)
router.post("/refresh-token", validateRequest(loginSchema), refreshAccessToken)

export default router;