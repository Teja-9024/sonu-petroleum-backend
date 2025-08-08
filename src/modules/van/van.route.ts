import express from "express";
import { createVan, getVans } from "./van.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { vanSchema } from "./van.schema";
import { requireAuth } from "../../middleware/auth";

const router = express.Router();

router.post("/create-van",requireAuth, validateRequest(vanSchema), createVan);
router.get("/vans",requireAuth, getVans);

export default router;

