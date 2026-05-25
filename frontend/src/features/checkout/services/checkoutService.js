import { api } from "@/lib/api";

export const checkoutService = {
  createOrder: (data, userId) => api.post(`/order/create/${userId}`, data),
};
