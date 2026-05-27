import { apiClient } from "@/api/axios";

export const userApi = {
  list() {
    return apiClient.get("/user/getAll").then((response) => response.data);
  },
};
