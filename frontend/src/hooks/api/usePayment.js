import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentApi } from "@/api/payment.api";

export function useCreateVnpayPaymentUrl() {
  return useMutation({
    mutationFn: (payload) => paymentApi.createVnpayPaymentUrl(payload),
  });
}

export function usePaypalConfig() {
  return useQuery({
    queryKey: ["paymentConfig"],
    queryFn: () => paymentApi.getPaypalConfig(),
    select: (response) => response?.data || "",
  });
}
