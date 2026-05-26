import { api } from "@/lib/api";

export const voucherService = {
  applyVoucher: (code, orderValue) => api.post("/voucher/apply", { code, orderValue }),
};
