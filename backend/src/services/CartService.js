const Cart = require("../models/CartModel");

// Thêm sản phẩm vào giỏ
const addToCart = async ({
  userId,
  productId,
  quantity,
  price,
  name,
  image,
}) => {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, price, name, image });
  }

  return await cart.save();
};

// Lấy giỏ hàng theo userId
const getCartByUser = async (userId) => {
  return await Cart.findOne({ userId }).populate("items.productId");
};

// Cập nhật số lượng sản phẩm
const updateCartItem = async (cartId, itemId, quantity) => {
  const cart = await Cart.findById(cartId);
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.id(itemId);
  if (!item) throw new Error("Item not found");

  item.quantity = quantity;

  return await cart.save();
};

// Xóa sản phẩm trong giỏ
const removeCartItem = async (cartId, itemId) => {
  const cart = await Cart.findById(cartId);
  if (!cart) throw new Error("Cart not found");

  cart.items.id(itemId).remove();
  return await cart.save();
};

// Xóa toàn bộ giỏ
const clearCart = async (userId) => {
  await Cart.findOneAndDelete({ userId });
};

module.exports = {
  addToCart,
  getCartByUser,
  updateCartItem,
  removeCartItem,
  clearCart,
};
