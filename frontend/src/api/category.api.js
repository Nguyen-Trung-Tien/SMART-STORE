import { apiClient, publicClient } from "@/api/axios";

export function getCategories(params = {}) {
  return publicClient.get("/category/get-all", { params });
}

export function getCategoryDetails(id) {
  return publicClient.get(`/category/get-details/${id}`);
}

export function createCategory(payload) {
  return apiClient.post("/category/create", payload);
}

export function updateCategory(id, payload) {
  return apiClient.put(`/category/update/${id}`, payload);
}

export function deleteCategory(id) {
  return apiClient.delete(`/category/delete/${id}`);
}

export const categoryApi = {
  getCategories,
  getCategoryDetails,
  createCategory,
  updateCategory,
  deleteCategory,
};
