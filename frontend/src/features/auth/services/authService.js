import { api } from "@/lib/api";

export const authService = {
  login: (data) => api.post("/user/sign-in", data),
  register: (data) => api.post("/user/sign-up", data),
  logout: () => api.post("/user/log-out"),
  getMe: (id) => api.get(`/user/get-details/${id}`),
  updateProfile: (id, data) => api.put(`/user/update-user/${id}`, data),
  updatePassword: (data) => api.post("/user/update-password", data),
};
