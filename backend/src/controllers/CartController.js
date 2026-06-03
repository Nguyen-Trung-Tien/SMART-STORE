import CartService from "../services/CartService.js";

const addToCart = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { product, amount, name, image, price, discount } = req.body;
    if (!userId || !product || !amount || !name || !image || !price) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await CartService.addToCart(userId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { productId, amount } = req.body;
    if (!userId || !productId || amount === undefined) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await CartService.updateCartItem(userId, productId, amount);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await CartService.removeFromCart(userId, productId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getCart = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await CartService.getCart(userId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const syncCart = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { cartItems } = req.body;
    if (!userId || !cartItems) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await CartService.syncCart(userId, cartItems);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

export default {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  syncCart,
};
