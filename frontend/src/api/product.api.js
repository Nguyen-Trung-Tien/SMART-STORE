import { apiClient, publicClient } from "@/api/axios";

function normalizePage(page) {
  return Math.max(Number(page) || 1, 1);
}

function normalizeProductListParams(params = {}) {
  const normalized = {
    page: normalizePage(params.page),
    limit: params.limit || 12,
  };

  if (params.search) {
    normalized.search = params.search;
  }

  if (params.category) {
    normalized.category = params.category;
  }

  if (Array.isArray(params.categories) && params.categories.length) {
    normalized.categories = params.categories.join(",");
  }

  if (params.featured !== undefined) {
    normalized.featured = params.featured;
  }

  if (params.sort) {
    normalized.sort = params.sort;
  }

  if (params.sortBy) {
    normalized.sortBy = params.sortBy;
  }

  if (params.sortOrder) {
    normalized.sortOrder = params.sortOrder;
  }

  if (params.brand) {
    normalized.brand = params.brand;
  }

  if (params.minPrice !== undefined) {
    normalized.minPrice = params.minPrice;
  }

  if (params.maxPrice !== undefined) {
    normalized.maxPrice = params.maxPrice;
  }

  return normalized;
}

export function getProducts(params) {
  return publicClient.get("/products", {
    params: normalizeProductListParams(params),
  });
}

export function getProductBySlug(slug) {
  return publicClient.get(`/products/${slug}`);
}

export function getProductById(id) {
  return publicClient.get(`/product/get-details/${id}`);
}

export function createProduct(payload) {
  return apiClient.post("/products", payload);
}

export function updateProduct(id, payload) {
  return apiClient.patch(`/products/${id}`, payload);
}

export function deleteProduct(id) {
  return apiClient.delete(`/products/${id}`);
}

export function getFeaturedProducts(params = {}) {
  return getProducts({
    ...params,
    featured: true,
  });
}

export const productApi = {
  list: getProducts,
  detail: getProductById,
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  create: createProduct,
  update: updateProduct,
  remove: deleteProduct,
  getFeaturedProducts,
};
