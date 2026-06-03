import Category from "../models/CategoryModel.js";

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

const createCategory = async (data) => {
  const { name } = data;
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw createHttpError(400, "The category name is already in use");
  }

  const newCategory = await Category.create(data);
  return buildResponse(newCategory, "Category created successfully");
};

const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!category) {
    throw createHttpError(404, "The category is not defined");
  }
  return buildResponse(category, "Category updated successfully");
};

const getCategoryDetails = async (id) => {
  const category = await Category.findById(id).populate("parent ancestors");
  if (!category) {
    throw createHttpError(404, "The category is not defined");
  }
  return buildResponse(category);
};

const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw createHttpError(404, "The category is not defined");
  }

  const hasChildren = await Category.exists({ parent: id });
  if (hasChildren) {
    throw createHttpError(400, "Cannot delete category with children. Please delete or reassign them first.");
  }

  await Category.findByIdAndDelete(id);
  return buildResponse(null, "Category deleted successfully");
};

const getAllCategories = async (query = {}) => {
  const filter = {};
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive;
  }
  if (query.parent !== undefined) {
    filter.parent = query.parent === "null" ? null : query.parent;
  }
  
  const sort = { sortOrder: 1, createdAt: -1 };
  const categories = await Category.find(filter).sort(sort).populate("parent");
  
  return buildResponse(categories);
};

export default {
  createCategory,
  updateCategory,
  getCategoryDetails,
  deleteCategory,
  getAllCategories,
};
