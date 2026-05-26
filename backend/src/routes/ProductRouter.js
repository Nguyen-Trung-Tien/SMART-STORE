import express from "express";
import productController from "../controllers/ProductController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/rbacMiddleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

router.post("/create", authMiddleware, requirePermission(PERMISSIONS.PRODUCT_CREATE), productController.createProduct);
router.put("/update/:id", authMiddleware, requirePermission(PERMISSIONS.PRODUCT_UPDATE), productController.updateProduct);
router.get("/get-details/:id", productController.getDetailsProduct);
router.delete("/delete/:id", authMiddleware, requirePermission(PERMISSIONS.PRODUCT_DELETE), productController.deleteProduct);
router.get("/get-all", productController.getAllProduct);
router.post("/delete-many", authMiddleware, requirePermission(PERMISSIONS.PRODUCT_DELETE), productController.deleteManyProduct);
router.get("/get-all-type", productController.getAllType);

export default router;
