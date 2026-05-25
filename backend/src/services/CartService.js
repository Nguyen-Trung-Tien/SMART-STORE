import Cart from "../models/CartModel.js";

const addToCart = (userId, cartItem) => {
  return new Promise(async (resolve, reject) => {
    try {
      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        cart = await Cart.create({
          user: userId,
          cartItems: [cartItem],
        });
      } else {
        const productIndex = cart.cartItems.findIndex(
          (item) => item.product.toString() === cartItem.product
        );

        if (productIndex > -1) {
          // If product exists in cart, update amount
          cart.cartItems[productIndex].amount += cartItem.amount;
        } else {
          // If product does not exist, push new item
          cart.cartItems.push(cartItem);
        }
        await cart.save();
      }

      resolve({
        status: "OK",
        message: "Added to cart successfully",
        data: cart,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateCartItem = (userId, productId, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return resolve({
          status: "ERR",
          message: "Cart not found",
        });
      }

      const productIndex = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex > -1) {
        if (amount <= 0) {
          cart.cartItems.splice(productIndex, 1);
        } else {
          cart.cartItems[productIndex].amount = amount;
        }
        await cart.save();
        resolve({
          status: "OK",
          message: "Updated cart successfully",
          data: cart,
        });
      } else {
        resolve({
          status: "ERR",
          message: "Product not found in cart",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const removeFromCart = (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return resolve({
          status: "ERR",
          message: "Cart not found",
        });
      }

      cart.cartItems = cart.cartItems.filter(
        (item) => item.product.toString() !== productId
      );
      await cart.save();

      resolve({
        status: "OK",
        message: "Removed from cart successfully",
        data: cart,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getCart = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await Cart.findOne({ user: userId }).populate("cartItems.product");
      if (!cart) {
        return resolve({
          status: "OK",
          message: "Cart is empty",
          data: { cartItems: [] },
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: cart,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const syncCart = (userId, guestCartItems) => {
  return new Promise(async (resolve, reject) => {
    try {
      let cart = await Cart.findOne({ user: userId });

      if (!cart) {
        cart = await Cart.create({
          user: userId,
          cartItems: guestCartItems,
        });
      } else {
        guestCartItems.forEach((guestItem) => {
          const productIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() === guestItem.product
          );

          if (productIndex > -1) {
            cart.cartItems[productIndex].amount += guestItem.amount;
          } else {
            cart.cartItems.push(guestItem);
          }
        });
        await cart.save();
      }

      resolve({
        status: "OK",
        message: "Synced cart successfully",
        data: cart,
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
  syncCart,
};
