const express = require("express");
const router = express.Router();
const CartController = require("../controllers/CartController");

router.post("/addCart", CartController.addToCart);
router.get("/get-cart/:userId", CartController.getCartByUser);
router.put("/update-cart/:cartId/item/:itemId", CartController.updateCartItem);
router.delete("/:cartId/item/:itemId", CartController.removeCartItem);
router.delete("/clear/:userId", CartController.clearCart);

module.exports = router;
