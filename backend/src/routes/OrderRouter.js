const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

router.post("/create", OrderController.createOrder);
router.get("/get-all-order/:id", OrderController.getAllOrderDetails);
router.get("/get-details-order/:id", OrderController.getDetailsOrder);
router.delete("/cancel-order/:id", OrderController.cancelOrderDetails);
router.get("/get-all-order", OrderController.getAllOrder);
router.put("/confirm/:id", OrderController.confirmOrderDetails);
router.put("/pay/:id", OrderController.updateOrderPaid);
router.put("/deliver/:id", OrderController.updateOrderDelivered);
module.exports = router;
