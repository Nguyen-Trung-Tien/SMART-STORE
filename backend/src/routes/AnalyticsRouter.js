import express from "express";
import AnalyticsController from "../controllers/AnalyticsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, AnalyticsController.getDashboardStats);

export default router;