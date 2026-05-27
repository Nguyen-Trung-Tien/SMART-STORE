import { apiClient, publicClient } from "@/api/axios";

export function login(payload) {
  return publicClient.post("/user/sign-in", payload);
}

export function register(payload) {
  return publicClient.post("/user/sign-up", payload);
}

export function logoutUser() {
  return apiClient.post("/user/log-out");
}

export function refreshToken() {
  return publicClient.post("/user/refresh-token");
}

export function getProfile(userId) {
  return apiClient.get(`/user/get-details/${userId}`);
}

export function updateProfile(userId, payload) {
  return apiClient.put(`/user/update-user/${userId}`, payload);
}

export function updatePassword(payload) {
  return apiClient.post("/user/update-password", payload);
}

export function forgotPassword(payload) {
  return publicClient.post("/user/forgot-password", payload);
}

export function resetPassword(payload) {
  return publicClient.post("/user/reset-password", payload);
}

export const authApi = {
  login,
  register,
  logout: logoutUser,
  refreshToken,
  getProfile,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
};
