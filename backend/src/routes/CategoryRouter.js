import express from "express";
import CategoryController from "../controllers/CategoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/rbacMiddleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

const canCreateCategory = [authMiddleware, requirePermission(PERMISSIONS.CATEGORY_CREATE)];
const canUpdateCategory = [authMiddleware, requirePermission(PERMISSIONS.CATEGORY_UPDATE)];
const canDeleteCategory = [authMiddleware, requirePermission(PERMISSIONS.CATEGORY_DELETE)];

router.post("/create", ...canCreateCategory, CategoryController.createCategory);
router.put("/update/:id", ...canUpdateCategory, CategoryController.updateCategory);
router.delete("/delete/:id", ...canDeleteCategory, CategoryController.deleteCategory);
router.get("/get-all", CategoryController.getAllCategories);
router.get("/get-details/:id", CategoryController.getCategoryDetails);

export default router;
