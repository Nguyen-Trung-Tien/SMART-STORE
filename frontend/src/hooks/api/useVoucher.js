import { useMutation } from "@tanstack/react-query";
import { voucherApi } from "@/api/voucher.api";

export function useApplyVoucher() {
  return useMutation({
    mutationFn: ({ code, orderValue }) => voucherApi.applyVoucher({ code, orderValue }),
  });
}
