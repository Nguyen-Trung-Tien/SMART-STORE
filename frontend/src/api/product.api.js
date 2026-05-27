import { apiClient, publicClient } from "@/api/axios";

export const productApi = {
  list(params) {
    return publicClient.get("/product/get-all", { params }).then((response) => response.data);
  },
  detail(id) {
    return publicClient.get(`/product/get-details/${id}`).then((response) => response.data);
  },
  create(payload) {
    return apiClient.post("/product/create", payload).then((response) => response.data);
  },
  update(id, payload) {
    return apiClient.put(`/product/update/${id}`, payload).then((response) => response.data);
  },
  remove(id) {
    return apiClient.delete(`/product/delete/${id}`).then((response) => response.data);
  },
};
