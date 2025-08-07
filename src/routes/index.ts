import express from "express";
import userRoutes from "../modules/user/user.route";
import dieselRateRoutes from "../modules/dieselRate/dieselRate.route";

const router = express.Router();

router.use("/api/users", userRoutes);
router.use("/api", dieselRateRoutes);

export default router;