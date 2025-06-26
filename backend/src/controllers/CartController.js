const CartService = require("../services/CartService");

// Thêm sản phẩm vào giỏ
const addToCart = async (req, res) => {
  try {
    const data = await CartService.addToCart(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy giỏ hàng theo userId
const getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await CartService.getCartByUser(userId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ
const updateCartItem = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;
    const updatedCart = await CartService.updateCartItem(
      cartId,
      itemId,
      quantity
    );
    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa sản phẩm trong giỏ
const removeCartItem = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const updatedCart = await CartService.removeCartItem(cartId, itemId);
    res.status(200).json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa toàn bộ giỏ
const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await CartService.clearCart(userId);
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addToCart,
  getCartByUser,
  updateCartItem,
  removeCartItem,
  clearCart,
};
