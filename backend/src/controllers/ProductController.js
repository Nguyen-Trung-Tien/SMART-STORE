import ProductService from "../services/ProductService.js";
import cloudinary from "../config/cloudinary.js";

const createProduct = async (req, res, next) => {
  try {
    let { name, image, type, price, countInStock, rating, description, discount } = req.body;
    if (!name || !image || !type || !price || !countInStock || !rating) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    if (image && image.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
      image = uploadResponse.secure_url;
    }

    const response = await ProductService.createProduct({ ...req.body, image });
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    let data = req.body;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    if (data.image && data.image.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(data.image, {
        folder: "products",
      });
      data = { ...data, image: uploadResponse.secure_url };
    }

    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getDetailsProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteManyProduct = async (req, res, next) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(400).json({
        status: "ERR",
        message: "The ids is required",
      });
    }
    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getAllProduct = async (req, res, next) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllProduct(
      Number(limit) || null,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

const getAllType = async (req, res, next) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};

export default {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType,
};
