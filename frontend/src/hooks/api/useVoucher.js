import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { voucherApi } from "@/api/voucher.api";
import { queryKeys } from "@/lib/queryKeys";

export function useApplyVoucher() {
  return useMutation({
    mutationFn: ({ code, orderValue }) => voucherApi.applyVoucher({ code, orderValue }),
  });
}

export function useVouchers(params = {}) {
  const query = useQuery({
    queryKey: queryKeys.vouchers.list(params),
    queryFn: () => voucherApi.getAllVouchers(params),
  });

  return {
    ...query,
    vouchers: query.data?.data || [],
  };
}

export function useVoucher(id) {
  const query = useQuery({
    queryKey: ["vouchers", "detail", id],
    queryFn: () => voucherApi.getVoucherById(id),
    enabled: !!id,
  });

  return {
    ...query,
    voucher: query.data?.data || null,
  };
}

export function useCreateVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: voucherApi.createVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers.all });
    },
  });
}

export function useUpdateVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => voucherApi.updateVoucher(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers.all });
      queryClient.invalidateQueries({ queryKey: ["vouchers", "detail", variables.id] });
    },
  });
}

export function useDeleteVoucher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: voucherApi.deleteVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers.all });
    },
  });
}
