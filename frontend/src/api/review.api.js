import { publicClient, apiClient } from "@/api/axios";

export function getProductReviews(productId) {
  return publicClient.get(`/review/get-by-product/${productId}`);
}

export function createReview(payload) {
  return apiClient.post("/review/create", payload);
}

export const reviewApi = {
  getProductReviews,
  createReview,
};
