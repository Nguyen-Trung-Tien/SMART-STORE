import WishlistService from "../services/WishlistService.js";

const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const response = await WishlistService.toggleWishlist(userId, productId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const response = await WishlistService.getWishlist(userId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

export default {
  toggleWishlist,
  getWishlist,
};
