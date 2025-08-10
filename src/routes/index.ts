import express from "express";
import userRoutes from "../modules/user/user.route";
import dieselRateRoutes from "../modules/dieselRate/dieselRate.route";
import vanRoutes from "../modules/van/van.route";
import intakeRoutes from "../modules/intake/intake.route";
import deliveryRoutes from "../modules/delivery/delivery.route";
import notificationsRoutes from "../modules/notifications/notifications.route";


const router = express.Router();

router.use("/api/users", userRoutes);
router.use("/api/fuel-rates", dieselRateRoutes);
router.use("/api/vans", vanRoutes);
router.use("/api/intakes", intakeRoutes);
router.use("/api/deliveries", deliveryRoutes);
router.use("/api/notifications", notificationsRoutes);
// router.use("/api/intakes", intakeRoutes);
// router.use("/api/deliveries", deliveryRoutes);
// router.use("/api/notifications", notificationRoutes);
// router.use("/api/suppliers", supplierRoutes);

export default router;