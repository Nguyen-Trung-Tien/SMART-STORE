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
  OrderController.getAllOrderDetails
);
router.get(
  "/get-details-order/:id",
  authUserMiddleware,
  OrderController.getDetailsOrder
);
router.delete(
  "/cancel-order/:id",
  authUserMiddleware,
  OrderController.cancelOrderDetails
);
router.get(
  "/get-all-order",
  authUserMiddleware,
  authMiddleware,
  OrderController.getAllOrder
);
router.put(
  "/confirm/:id",
  authUserMiddleware,
  OrderController.confirmOrderDetails
);
router.put("/pay/:id", authUserMiddleware, OrderController.updateOrderPaid);
router.put(
  "/deliver/:id",
  authUserMiddleware,
  OrderController.updateOrderDelivered
);
module.exports = router;
