import express from "express";
import userController from "../controllers/UserController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/rbacMiddleware.js";
import { PERMISSIONS } from "../constants/permissions.js";
import validate from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import delay from "../middleware/delay.js";

const router = express.Router();

router.all("*", delay);
router.post("/sign-up", validate(registerSchema), userController.createUser);
router.post("/sign-in", validate(loginSchema), userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.put("/update-user/:id", authMiddleware, userController.updateUser);
router.delete("/delete-user/:id", authMiddleware, requirePermission(PERMISSIONS.USER_DELETE), userController.deleteUser);
router.get("/getAll", authMiddleware, requirePermission(PERMISSIONS.USER_READ), userController.getAllUser);
router.get("/get-details/:id", authMiddleware, userController.getDetailsUser);
router.post("/refresh-token", userController.refreshToken);
router.post("/delete-many", authMiddleware, requirePermission(PERMISSIONS.USER_DELETE), userController.deleteManyUser);
router.post("/update-password", authMiddleware, userController.updatePassword);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

export default router;
