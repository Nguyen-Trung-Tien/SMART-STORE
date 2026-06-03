import { apiClient } from "@/api/axios";

export function getWishlist() {
  return apiClient.get("/wishlist/get");
}

export function toggleWishlist(productId) {
  return apiClient.post("/wishlist/toggle", { productId });
}

export const wishlistApi = {
  getWishlist,
  toggleWishlist,
};
