import express from "express";
import VoucherController from "../controllers/VoucherController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/rbacMiddleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

const canManagePromotion = [authMiddleware, requirePermission(PERMISSIONS.PROMOTION_MANAGE)];

router.post("/apply", VoucherController.applyVoucher);
router.post("/create", ...canManagePromotion, VoucherController.createVoucher);
router.put("/update/:id", ...canManagePromotion, VoucherController.updateVoucher);
router.delete("/delete/:id", ...canManagePromotion, VoucherController.deleteVoucher);
router.get("/get-all", ...canManagePromotion, VoucherController.getAllVouchers);
router.get("/get-details/:id", ...canManagePromotion, VoucherController.getVoucherById);

export default router;
