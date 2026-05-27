import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart, getCart, removeCartItem, syncCart, updateCartItem } from "@/api/cart.api";
import { queryKeys } from "@/lib/queryKeys";

export function useCart(userId) {
  return useQuery({
    queryKey: queryKeys.cart.detail(userId),
    queryFn: () => getCart(userId),
    enabled: Boolean(userId),
    staleTime: 30000,
    select: (response) => response?.data || null,
  });
}

export function useAddToCart(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => addToCart(userId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.detail(userId) }),
  });
}

export function useUpdateCartItem(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => updateCartItem(userId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.detail(userId) }),
  });
}

export function useRemoveCartItem(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.detail(userId) }),
  });
}

export function useSyncCart(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => syncCart(userId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.detail(userId) }),
  });
}
