import { apiClient } from "@/api/axios";

export function getCart(userId) {
  return apiClient.get(`/cart/get-all/${userId}`);
}

export function addToCart(userId, payload) {
  return apiClient.post(`/cart/add/${userId}`, payload);
}

export function updateCartItem(userId, payload) {
  return apiClient.put(`/cart/update/${userId}`, payload);
}

export function removeCartItem(userId) {
  return apiClient.delete(`/cart/remove/${userId}`);
}

export function syncCart(userId, payload) {
  return apiClient.post(`/cart/sync/${userId}`, payload);
}

export const cartApi = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  syncCart,
};
