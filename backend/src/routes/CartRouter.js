import express from "express";
import CartController from "../controllers/CartController.js";
import { authUserMiddleware } from "../middleware/authUserMiddleware.js";

const router = express.Router();

router.post("/add/:id", authUserMiddleware, CartController.addToCart);
router.put("/update/:id", authUserMiddleware, CartController.updateCartItem);
router.delete("/remove/:id", authUserMiddleware, CartController.removeFromCart);
router.get("/get-all/:id", authUserMiddleware, CartController.getCart);
router.post("/sync/:id", authUserMiddleware, CartController.syncCart);

export default router;
