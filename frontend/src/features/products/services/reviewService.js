import { api } from "@/lib/api";

export const reviewService = {
  getReviews: (productId) => api.get(`/review/get-by-product/${productId}`),
  createReview: (data) => api.post("/review/create", data),
};
