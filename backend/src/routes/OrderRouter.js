const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const {
  authUserMiddleware,
  authMiddleware,
} = require("../middleware/authMiddleware");
const delay = require("../middleware/delay");

router.all("*", delay);
router.post("/create", OrderController.createOrder);
router.get(
  "/get-all-order/:id",
  authUserMiddleware,
  OrderController.getAllOrderDetails
);
router.get(
  "/get-details-order/:id",

  OrderController.getDetailsOrder
);
router.delete(
  "/cancel-order/:id",

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

  OrderController.confirmOrderDetails
);
router.put("/pay/:id", OrderController.updateOrderPaid);
router.put("/deliver/:id", OrderController.updateOrderDelivered);
module.exports = router;
