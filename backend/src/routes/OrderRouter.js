const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const {
  authUserMiddleware,
  authMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create", OrderController.createOrder);
router.get(
  "/get-all-order/:id",
  authUserMiddleware,
  authMiddleware,
  OrderController.getAllOrderDetails
);
router.get(
  "/get-details-order/:id",
  authUserMiddleware,
  OrderController.getDetailsOrder
);
router.delete("/cancel-order/:id", OrderController.cancelOrderDetails);
router.get("/get-all-order", OrderController.getAllOrder);
router.put("/confirm/:id", OrderController.confirmOrderDetails);
module.exports = router;
