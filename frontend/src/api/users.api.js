import { apiClient } from "@/api/axios";

export function getUsers(params = {}) {
  return apiClient.get("/user/getAll", { params });
}

export function deleteUser(id) {
  return apiClient.delete(`/user/delete-user/${id}`);
}

export function changeRole(id, role) {
  return apiClient.patch(`/user/change-role/${id}`, { role });
}

export const usersApi = {
  getUsers,
  deleteUser,
  changeRole,
};
