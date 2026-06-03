import { apiClient } from "@/api/axios";

export function createOrder(userId, payload) {
  return apiClient.post(`/order/create/${userId}`, payload);
}

export function getOrders(userId) {
  return apiClient.get(`/order/get-all-order/${userId}`);
}

export function getOrderById(orderId) {
  return apiClient.get(`/order/get-details-order/${orderId}`);
}

export function cancelOrder(orderId) {
  return apiClient.delete(`/order/cancel-order/${orderId}`);
}

export function getAdminOrders() {
  return apiClient.get("/order/get-all-order");
}

export function updateOrderStatus(orderId, payload) {
  return apiClient.patch(`/order/update-order-status/${orderId}`, payload);
}

export function downloadInvoice(orderId) {
  return apiClient.get(`/order/download-invoice/${orderId}`, {
    responseType: "blob",
  });
}

export const orderApi = {
  create: createOrder,
  listByUser: getOrders,
  detail: getOrderById,
  adminList: getAdminOrders,
  updateStatus: updateOrderStatus,
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  getAdminOrders,
  updateOrderStatus,
  downloadInvoice,
};
