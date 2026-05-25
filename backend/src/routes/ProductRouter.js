import express from "express";
import productController from "../controllers/ProductController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", productController.createProduct);
router.put("/update/:id", authMiddleware, productController.updateProduct);
router.get("/get-details/:id", productController.getDetailsProduct);
router.delete("/delete/:id", authMiddleware, productController.deleteProduct);
router.get("/get-all", productController.getAllProduct);
router.post("/delete-many", authMiddleware, productController.deleteManyProduct);
router.get("/get-all-type", productController.getAllType);

export default router;
