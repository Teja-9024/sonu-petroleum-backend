import express from "express";
import { loginUser, registerUser } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { loginSchema } from "./user.schema";

const router = express.Router();

router.post("/login", validateRequest(loginSchema), loginUser)
.post("/register", validateRequest(loginSchema), registerUser)

export default router;