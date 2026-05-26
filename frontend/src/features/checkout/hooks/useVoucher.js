import { useMutation } from "@tanstack/react-query";
import { voucherService } from "../services/voucherService";
import { toast } from "sonner";

export const useApplyVoucher = () => {
  return useMutation({
    mutationFn: ({ code, orderValue }) => voucherService.applyVoucher(code, orderValue),
    onSuccess: (data) => {
      if (data.status === "OK") {
        toast.success(`Áp dụng mã giảm giá thành công!`);
      } else {
        toast.error(data.message || "Mã giảm giá không hợp lệ");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Đã có lỗi xảy ra");
    }
  });
};
