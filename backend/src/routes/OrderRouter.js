import express from "express";
import orderController from "../controllers/OrderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authUserMiddleware } from "../middleware/authUserMiddleware.js";

const router = express.Router();

router.post("/create/:id", authUserMiddleware, orderController.createOrder);
router.get("/get-all-order/:id", authUserMiddleware, orderController.getAllOrderDetails);
router.get("/get-details-order/:id", orderController.getDetailsOrder);
router.delete("/cancel-order/:id", authUserMiddleware, orderController.cancelOrderDetails);
router.get("/get-all", authMiddleware, orderController.getAllOrder);

export default router;
