import Wishlist from "../models/WishlistModel.js";

const toggleWishlist = (userId, productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let wishlist = await Wishlist.findOne({ user: userId });
      if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, products: [productId] });
        return resolve({
          status: "OK",
          message: "Added to wishlist",
          data: wishlist,
        });
      }

      const index = wishlist.products.indexOf(productId);
      if (index > -1) {
        // Remove
        wishlist.products.splice(index, 1);
        await wishlist.save();
        resolve({
          status: "OK",
          message: "Removed from wishlist",
          data: wishlist,
        });
      } else {
        // Add
        wishlist.products.push(productId);
        await wishlist.save();
        resolve({
          status: "OK",
          message: "Added to wishlist",
          data: wishlist,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getWishlist = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const wishlist = await Wishlist.findOne({ user: userId }).populate("products");
      if (!wishlist) {
        return resolve({
          status: "OK",
          message: "SUCCESS",
          data: [],
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: wishlist.products,
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  toggleWishlist,
  getWishlist,
};
