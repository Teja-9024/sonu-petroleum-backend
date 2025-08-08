import express from "express";
import userRoutes from "../modules/user/user.route";
import dieselRateRoutes from "../modules/dieselRate/dieselRate.route";
import vanRoutes from "../modules/van/van.route";
import intakeRoutes from "../modules/intake/intake.route";
import deliveryRoutes from "../modules/delivery/delivery.route";


const router = express.Router();

router.use("/api/users", userRoutes);
router.use("/api", dieselRateRoutes);
router.use("/api", vanRoutes);
router.use("/api", intakeRoutes);
router.use("/api", deliveryRoutes);
// router.use("/api/intakes", intakeRoutes);
// router.use("/api/deliveries", deliveryRoutes);
// router.use("/api/notifications", notificationRoutes);
// router.use("/api/suppliers", supplierRoutes);

export default router;