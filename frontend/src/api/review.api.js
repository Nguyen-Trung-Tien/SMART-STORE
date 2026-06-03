import { apiClient, publicClient } from "@/api/axios";

export function createReview(payload) {
  return apiClient.post("/review/create", payload);
}

export function getProductReviews(productId) {
  return publicClient.get(`/review/get-by-product/${productId}`);
}

export function getAllReviews(params = {}) {
  return apiClient.get("/review/get-all", { params });
}

export function deleteReview(id) {
  return apiClient.delete(`/review/delete/${id}`);
}

export function updateReviewStatus(id, status) {
  return apiClient.patch(`/review/update-status/${id}`, { status });
}

export const reviewApi = {
  createReview,
  getProductReviews,
  getAllReviews,
  deleteReview,
  updateReviewStatus,
};
