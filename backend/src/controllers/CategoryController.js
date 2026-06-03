import CategoryService from "../services/CategoryService.js";

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        status: "ERR",
        message: "The name is required",
      });
    }
    const response = await CategoryService.createCategory(req.body);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(400).json({
        status: "ERR",
        message: "The categoryId is required",
      });
    }
    const response = await CategoryService.updateCategory(categoryId, req.body);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getCategoryDetails = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(400).json({
        status: "ERR",
        message: "The categoryId is required",
      });
    }
    const response = await CategoryService.getCategoryDetails(categoryId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(400).json({
        status: "ERR",
        message: "The categoryId is required",
      });
    }
    const response = await CategoryService.deleteCategory(categoryId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getAllCategories = async (req, res, next) => {
  try {
    const response = await CategoryService.getAllCategories(req.query);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

export default {
  createCategory,
  updateCategory,
  getCategoryDetails,
  deleteCategory,
  getAllCategories,
};
