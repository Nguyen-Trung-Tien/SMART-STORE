import ProductService from "../services/ProductService.js";

const createProduct = async (req, res, next) => {
  try {
    const response = await ProductService.createProduct(req.body);
    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const response = await ProductService.updateProduct(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const getDetailsProduct = async (req, res, next) => {
  try {
    const response = await ProductService.getDetailsProduct(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const response = await ProductService.getProductBySlug(req.params.slug);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const response = await ProductService.deleteProduct(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const deleteManyProduct = async (req, res, next) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    if (!ids.length) {
      return res.status(400).json({
        status: "ERR",
        message: "ids is required",
      });
    }

    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const getAllProduct = async (req, res, next) => {
  try {
    const response = await ProductService.getAllProduct(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const getAllType = async (_req, res, next) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

export default {
  createProduct,
  updateProduct,
  getDetailsProduct,
  getProductBySlug,
  deleteProduct,
  deleteManyProduct,
  getAllProduct,
  getAllType,
};
