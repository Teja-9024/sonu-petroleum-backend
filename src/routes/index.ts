import express from "express";
import userRoutes from "../modules/user/user.route";

const router = express.Router();

router.use("/api/users", userRoutes);

export default router;