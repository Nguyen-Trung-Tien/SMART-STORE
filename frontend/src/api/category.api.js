import { apiClient, publicClient } from "@/api/axios";

export function getCategories(params = {}) {
  return publicClient.get("/categories", { params });
}

export function getCategoryBySlug(slug) {
  return publicClient.get(`/categories/${slug}`);
}

export function createCategory(payload) {
  return apiClient.post("/categories", payload);
}

export function updateCategory(id, payload) {
  return apiClient.patch(`/categories/${id}`, payload);
}

export function deleteCategory(id) {
  return apiClient.delete(`/categories/${id}`);
}

export const categoryApi = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
