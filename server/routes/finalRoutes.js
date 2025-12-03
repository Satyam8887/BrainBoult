// routes/finalRoutes.js
import express from "express";
import { getFinalPage } from "../controllers/finalController.js";

const router = express.Router();

router.get("/final", getFinalPage);   // ✅ matches /final

export default router;
