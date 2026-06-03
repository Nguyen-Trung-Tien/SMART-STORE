import Review from "../models/ReviewModel.js";
import Product from "../models/ProductModel.js";

const buildResponse = (data, message = "SUCCESS", extra = {}) => ({
  status: "OK",
  message,
  ...extra,
  data,
});

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const createReview = async (userId, data) => {
  const { product, rating, comment, images } = data;
  const existing = await Review.findOne({ product, user: userId });
  if (existing) {
    throw createHttpError(400, "You have already reviewed this product");
  }

  const newReview = await Review.create({
    product,
    user: userId,
    rating,
    comment,
    images,
  });

  return buildResponse(newReview, "Review created successfully");
};

const getProductReviews = async (productId) => {
  const reviews = await Review.find({ product: productId, status: "published" }).populate("user", "name avatar");
  return buildResponse(reviews);
};

const getAllReviews = async (query = {}) => {
  const reviews = await Review.find(query).sort({ createdAt: -1 }).populate("user", "name email").populate("product", "name image");
  return buildResponse(reviews);
};

const deleteReview = async (id) => {
  const deleted = await Review.findByIdAndDelete(id);
  if (!deleted) {
    throw createHttpError(404, "Review not found");
  }
  return buildResponse(null, "Review deleted successfully");
};

const updateReviewStatus = async (id, status) => {
  const allowedStatuses = ["pending", "published", "rejected", "hidden"];
  if (!allowedStatuses.includes(status)) {
    throw createHttpError(400, "Invalid status");
  }
  
  const updated = await Review.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  if (!updated) {
    throw createHttpError(404, "Review not found");
  }

  // Manually trigger the post-save sync behavior for ratings if status changes
  const [summary] = await Review.aggregate([
    {
      $match: {
        product: updated.product,
        status: "published",
      },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  await Product.findByIdAndUpdate(updated.product, {
    rating: summary ? Number(summary.avgRating.toFixed(1)) : 0,
    numReviews: summary ? summary.numReviews : 0,
  });

  return buildResponse(updated, `Review status updated to ${status}`);
};

export default {
  createReview,
  getProductReviews,
  getAllReviews,
  deleteReview,
  updateReviewStatus,
};
