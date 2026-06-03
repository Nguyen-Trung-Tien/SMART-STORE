import express from "express";
import ReviewController from "../controllers/ReviewController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/rbacMiddleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

const canManageReviews = [authMiddleware, requirePermission(PERMISSIONS.REVIEW_MANAGE)];

router.post("/create", authMiddleware, ReviewController.createReview);
router.get("/get-by-product/:id", ReviewController.getProductReviews);

// Admin routes
router.get("/get-all", ...canManageReviews, ReviewController.getAllReviews);
router.delete("/delete/:id", ...canManageReviews, ReviewController.deleteReview);
router.patch("/update-status/:id", ...canManageReviews, ReviewController.updateReviewStatus);

export default router;
