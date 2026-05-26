import { api } from "@/lib/api";

export const wishlistService = {
  getWishlist: () => api.get("/wishlist/get"),
  toggleWishlist: (productId) => api.post("/wishlist/toggle", { productId }),
};
