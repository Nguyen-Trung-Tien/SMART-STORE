import express from "express";
import userController from "../controllers/UserController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import delay from "../middleware/delay.js";

const router = express.Router();

router.all("*", delay);
router.post("/sign-up", validate(registerSchema), userController.createUser);
router.post("/sign-in", validate(loginSchema), userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", authMiddleware, userController.deleteUser);
router.get("/getAll", authMiddleware, userController.getAllUser);
router.get("/get-details/:id", userController.getDetailsUser);
router.post("/refresh-token", userController.refreshToken);
router.post("/delete-many", authMiddleware, userController.deleteManyUser);
router.post("/update-password", userController.updatePassword);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

export default router;
