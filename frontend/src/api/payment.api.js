import { apiClient, publicClient } from "@/api/axios";

export function createVnpayPaymentUrl(payload) {
  return publicClient.post("/vnpay/create_payment_url", payload);
}

export function getPaypalConfig() {
  return apiClient.get("/payment/config");
}

export const paymentApi = {
  createVnpayPaymentUrl,
  getPaypalConfig,
};
