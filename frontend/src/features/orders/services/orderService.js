import { api } from "@/lib/api";

export const orderService = {
  getOrdersByUser: (userId) => {
    return api.get(`/order/get-all-order/${userId}`);
  },
  
  getOrderDetails: (orderId) => {
    return api.get(`/order/get-details-order/${orderId}`);
  },
  
  cancelOrder: (orderId, userId) => {
    return api.delete(`/order/cancel-order/${orderId}`, { data: { userId } });
  },

  getAllOrders: () => {
    return api.get("/order/get-all-order");
  },

  updateOrderStatus: (orderId, status) => {
    return api.patch(`/order/update-order-status/${orderId}`, { status });
  },

  downloadInvoice: (orderId) => {
    return api.get(`/order/download-invoice/${orderId}`, { responseType: 'blob' });
  }
};
