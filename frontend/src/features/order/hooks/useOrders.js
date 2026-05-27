import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/api/order.api";
import { queryKeys } from "@/config/constants";

export function useOrders(userId) {
  return useQuery({
    queryKey: queryKeys.orders(userId),
    queryFn: () => orderApi.listByUser(userId),
    enabled: Boolean(userId),
    select: (response) => response?.data || [],
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: queryKeys.adminOrders,
    queryFn: orderApi.adminList,
    select: (response) => response?.data || [],
  });
}

export function useCreateOrder(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => orderApi.create(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders(userId) });
    },
  });
}
