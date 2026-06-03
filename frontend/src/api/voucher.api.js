import { apiClient, publicClient } from "@/api/axios";

export function applyVoucher(payload) {
  return publicClient.post("/voucher/apply", payload);
}

export function getAllVouchers(params = {}) {
  return apiClient.get("/voucher/get-all", { params });
}

export function getVoucherById(id) {
  return apiClient.get(`/voucher/get-details/${id}`);
}

export function createVoucher(payload) {
  return apiClient.post("/voucher/create", payload);
}

export function updateVoucher(id, payload) {
  return apiClient.put(`/voucher/update/${id}`, payload);
}

export function deleteVoucher(id) {
  return apiClient.delete(`/voucher/delete/${id}`);
}

export const voucherApi = {
  applyVoucher,
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
};
