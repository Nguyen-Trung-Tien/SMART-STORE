import { apiClient, publicClient } from "@/api/axios";

export function createVnpayPaymentUrl(payload) {
  return publicClient.post("/vnpay/create_payment_url", payload);
}

export function getPaypalConfig() {
  return apiClient.get("/payment/config");
}

export function verifyVnpayPayment(params) {
  return apiClient.post("/vnpay/verify", params);
}

export const paymentApi = {
  createVnpayPaymentUrl,
  getPaypalConfig,
  verifyVnpayPayment,
};
