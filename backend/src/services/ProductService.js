import mongoose from "mongoose";
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;
const DEFAULT_SORT = { createdAt: -1, _id: -1 };
const ALLOWED_SORT_FIELDS = new Set([
  "name",
  "price",
  "rating",
  "createdAt",
  "updatedAt",
  "countInStock",
  "stock",
  "selling",
  "selled",
]);

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

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeImageAsset = (asset, options = {}) => {
  if (!asset) {
    return null;
  }

  if (typeof asset === "string") {
    return {
      url: asset,
      isPrimary: options.isPrimary ?? false,
    };
  }

  return {
    url: asset.url || asset.secure_url,
    alt: asset.alt,
    publicId: asset.publicId || asset.public_id,
    width: asset.width,
    height: asset.height,
    isPrimary: asset.isPrimary ?? options.isPrimary ?? false,
  };
};

const normalizeVariant = (variant = {}) => ({
  ...variant,
  countInStock:
    variant.countInStock ??
    variant.stock ??
    0,
  image: normalizeImageAsset(variant.image),
});

const normalizeProductPayload = (payload = {}, { isUpdate = false } = {}) => {
  const normalized = { ...payload };

  if ("thumbnail" in payload) {
    normalized.thumbnail = normalizeImageAsset(payload.thumbnail, { isPrimary: true });
  } else if (!isUpdate && payload.image) {
    normalized.thumbnail = normalizeImageAsset(payload.image, { isPrimary: true });
  }

  if ("images" in payload && Array.isArray(payload.images)) {
    normalized.images = payload.images
      .map((image, index) => normalizeImageAsset(image, { isPrimary: index === 0 }))
      .filter((image) => image?.url);
  }

  if (normalized.thumbnail?.url && !normalized.images?.length) {
    normalized.images = [normalized.thumbnail];
  }

  if ("variants" in payload && Array.isArray(payload.variants)) {
    normalized.variants = payload.variants.map(normalizeVariant);
  }

  if ("stock" in payload && !("countInStock" in payload)) {
    normalized.countInStock = payload.stock;
  }

  if ("category" in payload && payload.category === "") {
    normalized.category = null;
  }

  if ("categories" in payload && !Array.isArray(payload.categories)) {
    normalized.categories = [payload.categories].filter(Boolean);
  }

  if ("tags" in payload && !Array.isArray(payload.tags) && typeof payload.tags === "string") {
    normalized.tags = payload.tags
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (
    "searchKeywords" in payload &&
    !Array.isArray(payload.searchKeywords) &&
    typeof payload.searchKeywords === "string"
  ) {
    normalized.searchKeywords = payload.searchKeywords
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if ("image" in payload && typeof payload.image === "string") {
    normalized.image = payload.image;
  } else if (normalized.thumbnail?.url) {
    normalized.image = normalized.thumbnail.url;
  }

  return normalized;
};

const ensureCategoryExists = async (categoryId) => {
  if (!categoryId) {
    return;
  }

  if (!isObjectId(categoryId)) {
    throw createHttpError(400, "Invalid category id");
  }

  const category = await Category.findById(categoryId).select("_id");
  if (!category) {
    throw createHttpError(404, "Category not found");
  }
};

const buildSearchQuery = (search) => {
  if (!search) {
    return null;
  }

  const regex = new RegExp(escapeRegex(search.trim()), "i");
  return {
    $or: [
      { name: regex },
      { slug: regex },
      { description: regex },
      { shortDescription: regex },
      { brand: regex },
      { type: regex },
      { sku: regex },
      { tags: regex },
      { searchKeywords: regex },
    ],
  };
};

const applyLegacyFilter = (query, filter) => {
  if (!filter) {
    return;
  }

  if (Array.isArray(filter)) {
    for (let index = 0; index < filter.length; index += 2) {
      const field = filter[index];
      const value = filter[index + 1];
      if (field && value != null) {
        query[field] = { $regex: escapeRegex(String(value)), $options: "i" };
      }
    }
    return;
  }

  if (typeof filter === "object") {
    Object.entries(filter).forEach(([field, value]) => {
      if (value != null && value !== "") {
        query[field] = value;
      }
    });
  }
};

const buildFilterQuery = (params = {}) => {
  const query = {};
  const {
    category,
    categories,
    brand,
    type,
    status,
    featured,
    minPrice,
    maxPrice,
    inStock,
    filter,
  } = params;

  if (category) {
    query.category = category;
  }

  if (categories) {
    const categoryValues = Array.isArray(categories)
      ? categories
      : String(categories)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
    if (categoryValues.length) {
      query.categories = { $in: categoryValues };
    }
  }

  if (brand) {
    query.brand = { $regex: escapeRegex(String(brand)), $options: "i" };
  }

  if (type) {
    query.type = { $regex: escapeRegex(String(type)), $options: "i" };
  }

  if (status) {
    query.status = status;
  }

  if (featured != null) {
    query.isFeatured = featured === true || featured === "true";
  }

  if (minPrice != null || maxPrice != null) {
    query.price = {};
    if (minPrice != null && minPrice !== "") {
      query.price.$gte = Number(minPrice);
    }
    if (maxPrice != null && maxPrice !== "") {
      query.price.$lte = Number(maxPrice);
    }
  }

  if (inStock != null) {
    query.countInStock =
      inStock === true || inStock === "true" ? { $gt: 0 } : { $lte: 0 };
  }

  applyLegacyFilter(query, filter);
  return query;
};

const buildSortQuery = (params = {}) => {
  const { sort, sortBy, sortOrder } = params;
  const sortQuery = { ...DEFAULT_SORT };

  if (Array.isArray(sort) && sort.length >= 2) {
    const [direction, field] = sort;
    if (ALLOWED_SORT_FIELDS.has(field)) {
      return { [field === "stock" ? "countInStock" : field]: Number(direction) || -1, _id: -1 };
    }
  }

  let field = sortBy;
  let order = sortOrder;

  if (!field && typeof sort === "string") {
    const [sortField, sortDirection] = sort.split(":");
    field = sortField;
    order = sortDirection;
  }

  if (field && ALLOWED_SORT_FIELDS.has(field)) {
    sortQuery[field === "stock" ? "countInStock" : field] =
      String(order).toLowerCase() === "asc" ? 1 : -1;
  }

  return sortQuery;
};

const getPagination = (params = {}) => {
  const page = Math.max(Number(params.page) || DEFAULT_PAGE, 1);
  const limit = Math.min(Math.max(Number(params.limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const productPopulate = [
  {
    path: "category",
    select: "name slug image",
  },
  {
    path: "categories",
    select: "name slug image",
  },
];

const createProduct = async (payload) => {
  const normalizedPayload = normalizeProductPayload(payload);

  await ensureCategoryExists(normalizedPayload.category);

  const product = await Product.create(normalizedPayload);
  const populatedProduct = await Product.findById(product._id).populate(productPopulate);

  return buildResponse(populatedProduct, "Product created successfully");
};

const updateProduct = async (id, payload) => {
  if (!isObjectId(id)) {
    throw createHttpError(400, "Invalid product id");
  }

  const normalizedPayload = normalizeProductPayload(payload, { isUpdate: true });
  await ensureCategoryExists(normalizedPayload.category);

  const updatedProduct = await Product.findByIdAndUpdate(id, normalizedPayload, {
    new: true,
    runValidators: true,
  }).populate(productPopulate);

  if (!updatedProduct) {
    throw createHttpError(404, "Product not found");
  }

  return buildResponse(updatedProduct, "Product updated successfully");
};

const deleteProduct = async (id) => {
  if (!isObjectId(id)) {
    throw createHttpError(400, "Invalid product id");
  }

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    throw createHttpError(404, "Product not found");
  }

  return buildResponse({ _id: deletedProduct._id }, "Product deleted successfully");
};

const deleteManyProduct = async (ids = []) => {
  const validIds = ids.filter((id) => isObjectId(id));

  await Product.deleteMany({
    _id: { $in: validIds },
  });

  return buildResponse({ deletedIds: validIds }, "Products deleted successfully");
};

const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug }).populate(productPopulate);

  if (!product) {
    throw createHttpError(404, "Product not found");
  }

  return buildResponse(product);
};

const getDetailsProduct = async (id) => {
  if (!isObjectId(id)) {
    throw createHttpError(400, "Invalid product id");
  }

  const product = await Product.findById(id).populate(productPopulate);

  if (!product) {
    throw createHttpError(404, "Product not found");
  }

  return buildResponse(product);
};

const getAllProduct = async (params = {}) => {
  const { search, q } = params;
  const baseQuery = buildFilterQuery(params);
  const searchQuery = buildSearchQuery(search || q);
  const finalQuery = searchQuery ? { $and: [baseQuery, searchQuery] } : baseQuery;
  const { page, limit, skip } = getPagination(params);
  const sortQuery = buildSortQuery(params);

  const [products, total] = await Promise.all([
    Product.find(finalQuery).sort(sortQuery).skip(skip).limit(limit).populate(productPopulate),
    Product.countDocuments(finalQuery),
  ]);

  return buildResponse(products, "Products fetched successfully", {
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: skip + products.length < total,
      hasPrevPage: page > 1,
    },
    filters: {
      search: search || q || null,
      sort: sortQuery,
    },
  });
};

const getAllType = async () => {
  const allType = await Product.distinct("type");
  return buildResponse(allType, "Product types fetched successfully");
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
  normalizeProductPayload,
};
