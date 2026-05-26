import express from "express";
import ReviewController from "../controllers/ReviewController.js";
import { authUserMiddleware } from "../middleware/authUserMiddleware.js";

const router = express.Router();

router.post("/create", authUserMiddleware, ReviewController.createReview);
router.get("/get-by-product/:id", ReviewController.getProductReviews);

export default router;
