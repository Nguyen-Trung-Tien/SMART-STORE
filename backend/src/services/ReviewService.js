import Review from "../models/ReviewModel.js";
import Product from "../models/ProductModel.js";

const createReview = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { product, rating, comment } = data;
      const existing = await Review.findOne({ product, user: userId });
      if (existing) {
        return resolve({
          status: "ERR",
          message: "You have already reviewed this product",
        });
      }

      const newReview = await Review.create({
        product,
        user: userId,
        rating,
        comment,
        images: data.images, // Add this line
      });

      // Update product rating
      const reviews = await Review.find({ product });
      const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(product, { rating: Number(avgRating.toFixed(1)) });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: newReview,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getProductReviews = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const reviews = await Review.find({ product: productId }).populate("user", "name avatar");
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: reviews,
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  createReview,
  getProductReviews,
};
