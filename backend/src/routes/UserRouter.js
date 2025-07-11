const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authMiddleware } = require("../middleware/authMiddleware");
const delay = require("../middleware/delay");

router.all("*", delay);
router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
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
module.exports = router;
