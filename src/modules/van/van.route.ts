import express from "express";
import { createVan, getVans } from "./van.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { vanSchema } from "./van.schema";

const router = express.Router();

router.post("/create-van", validateRequest(vanSchema), createVan);
router.get("/vans", getVans);

export default router;
