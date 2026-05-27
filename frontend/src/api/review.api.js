import { publicClient } from "@/api/axios";

export function getProductReviews(productId) {
  return publicClient.get(`/review/get-by-product/${productId}`);
}

export const reviewApi = {
  getProductReviews,
};
