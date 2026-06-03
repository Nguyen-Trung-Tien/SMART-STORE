import express from "express";
import WishlistController from "../controllers/WishlistController.js";
import { authUserMiddleware } from "../middleware/authUserMiddleware.js";

const router = express.Router();

router.post("/toggle", authUserMiddleware, WishlistController.toggleWishlist);
router.get("/get", authUserMiddleware, WishlistController.getWishlist);

export default router;
