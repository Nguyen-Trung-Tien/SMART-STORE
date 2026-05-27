import { apiClient, publicClient } from "@/api/axios";

export const authApi = {
  login(payload) {
    return publicClient.post("/user/sign-in", payload).then((response) => response.data);
  },
  register(payload) {
    return publicClient.post("/user/sign-up", payload).then((response) => response.data);
  },
  logout() {
    return apiClient.post("/user/log-out").then((response) => response.data);
  },
  refreshToken() {
    return publicClient.post("/user/refresh-token").then((response) => response.data);
  },
  getProfile(userId) {
    return apiClient.get(`/user/get-details/${userId}`).then((response) => response.data);
  },
  updateProfile(userId, payload) {
    return apiClient.put(`/user/update-user/${userId}`, payload).then((response) => response.data);
  },
};
