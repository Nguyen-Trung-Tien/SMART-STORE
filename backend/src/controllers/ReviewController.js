import ReviewService from "../services/ReviewService.js";

const createReview = async (req, res, next) => {
  try {
    const { product, rating, comment } = req.body;
    const userId = req.user.id;
    if (!product || !rating || !comment) {
      return res.status(400).json({
        status: "ERR",
        message: "Product, rating, and comment are required",
      });
    }

    const response = await ReviewService.createReview(userId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getProductReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await ReviewService.getProductReviews(id);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getAllReviews = async (req, res, next) => {
  try {
    const response = await ReviewService.getAllReviews(req.query);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await ReviewService.deleteReview(id);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        status: "ERR",
        message: "Status is required",
      });
    }
    const response = await ReviewService.updateReviewStatus(id, status);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

export default {
  createReview,
  getProductReviews,
  getAllReviews,
  deleteReview,
  updateReviewStatus,
};
