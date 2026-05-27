import express from "express";
import productController from "../controllers/ProductController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/rbacMiddleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

const canCreateProduct = [authMiddleware, requirePermission(PERMISSIONS.PRODUCT_CREATE)];
const canUpdateProduct = [authMiddleware, requirePermission(PERMISSIONS.PRODUCT_UPDATE)];
const canDeleteProduct = [authMiddleware, requirePermission(PERMISSIONS.PRODUCT_DELETE)];

router.get("/get-all", productController.getAllProduct);
router.get("/get-details/:id", productController.getDetailsProduct);
router.get("/get-all-type", productController.getAllType);
router.post("/create", ...canCreateProduct, productController.createProduct);
router.put("/update/:id", ...canUpdateProduct, productController.updateProduct);
router.patch("/update/:id", ...canUpdateProduct, productController.updateProduct);
router.delete("/delete/:id", ...canDeleteProduct, productController.deleteProduct);
router.post("/delete-many", ...canDeleteProduct, productController.deleteManyProduct);

router.get("/", productController.getAllProduct);
router.post("/", ...canCreateProduct, productController.createProduct);
router.patch("/:id", ...canUpdateProduct, productController.updateProduct);
router.delete("/:id", ...canDeleteProduct, productController.deleteProduct);
router.get("/:slug", productController.getProductBySlug);

export default router;
