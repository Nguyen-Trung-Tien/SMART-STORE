import { apiClient } from "@/api/axios";

export const orderApi = {
  create(userId, payload) {
    return apiClient.post(`/order/create/${userId}`, payload).then((response) => response.data);
  },
  listByUser(userId) {
    return apiClient.get(`/order/get-all-order/${userId}`).then((response) => response.data);
  },
  detail(id) {
    return apiClient.get(`/order/get-details-order/${id}`).then((response) => response.data);
  },
  adminList() {
    return apiClient.get("/order/get-all-order").then((response) => response.data);
  },
  updateStatus(id, payload) {
    return apiClient.patch(`/order/update-order-status/${id}`, payload).then((response) => response.data);
  },
};
