import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder, getAdminOrders, getOrders, updateOrderStatus } from "@/api/order.api";
import { queryKeys } from "@/lib/queryKeys";

export function useOrders(userId) {
  return useQuery({
    queryKey: queryKeys.orders.list(userId),
    queryFn: () => getOrders(userId),
    enabled: Boolean(userId),
    staleTime: 30000,
    select: (response) => response?.data || [],
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: queryKeys.orders.admin,
    queryFn: getAdminOrders,
    staleTime: 30000,
    select: (response) => response?.data || [],
  });
}

export function useCreateOrder(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createOrder(userId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.orders.list(userId) }),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }) => updateOrderStatus(orderId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
  });
}
