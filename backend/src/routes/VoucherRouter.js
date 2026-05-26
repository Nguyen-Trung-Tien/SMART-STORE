import express from "express";
import VoucherController from "../controllers/VoucherController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", VoucherController.applyVoucher);
router.post("/create", authMiddleware, VoucherController.createVoucher);

export default router;
