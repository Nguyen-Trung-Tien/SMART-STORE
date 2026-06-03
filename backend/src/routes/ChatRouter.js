import express from "express";
import ChatController from "../controllers/ChatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/rbacMiddleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

const canManageChat = [authMiddleware, requirePermission(PERMISSIONS.USER_READ)]; // Customer Support typically has this

router.get("/history", authMiddleware, ChatController.getHistory);
router.post("/mark-read", authMiddleware, ChatController.markAsRead);

// Admin only routes
router.get("/active", ...canManageChat, ChatController.getActiveChats);

export default router;
