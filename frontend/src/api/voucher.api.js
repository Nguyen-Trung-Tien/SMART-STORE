import { publicClient } from "@/api/axios";

export function applyVoucher(payload) {
  return publicClient.post("/voucher/apply", payload);
}

export const voucherApi = {
  applyVoucher,
};
