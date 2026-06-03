import { apiClient } from "@/api/axios";

export function getUserAddresses() {
  return apiClient.get("/address/get-all");
}

export function createAddress(payload) {
  return apiClient.post("/address/create", payload);
}

export function updateAddress(id, payload) {
  return apiClient.put(`/address/update/${id}`, payload);
}

export function deleteAddress(id) {
  return apiClient.delete(`/address/delete/${id}`);
}

export const addressApi = {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
