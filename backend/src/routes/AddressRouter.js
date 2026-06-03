import express from "express";
import AddressController from "../controllers/AddressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, AddressController.createAddress);
router.put("/update/:id", authMiddleware, AddressController.updateAddress);
router.delete("/delete/:id", authMiddleware, AddressController.deleteAddress);
router.get("/get-all", authMiddleware, AddressController.getUserAddresses);

export default router;
