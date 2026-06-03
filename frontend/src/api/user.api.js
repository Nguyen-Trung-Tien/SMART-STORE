import { apiClient } from "@/api/axios";

export function getUsers() {
  return apiClient.get("/user/getAll");
}

export function getUserById(userId) {
  return apiClient.get(`/user/get-details/${userId}`);
}

export function updateUser(userId, payload) {
  return apiClient.put(`/user/update-user/${userId}`, payload);
}

export function deleteUser(userId) {
  return apiClient.delete(`/user/delete-user/${userId}`);
}

export function deleteManyUsers(ids) {
  return apiClient.post("/user/delete-many", { ids });
}

export const userApi = {
  list: getUsers,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteManyUsers,
};
