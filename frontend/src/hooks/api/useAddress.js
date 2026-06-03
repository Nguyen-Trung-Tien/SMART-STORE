import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserAddresses, createAddress, updateAddress, deleteAddress } from "@/api/address.api";
import { queryKeys } from "@/lib/queryKeys";

export function useAddresses(userId) {
  const query = useQuery({
    queryKey: queryKeys.address.user(userId),
    queryFn: getUserAddresses,
    enabled: !!userId,
  });

  return {
    ...query,
    addresses: query.data?.data || [],
  };
}

export function useCreateAddress(userId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.address.user(userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile(userId) });
      }
    },
  });
}

export function useUpdateAddress(userId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateAddress(id, data),
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.address.user(userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile(userId) });
      }
    },
  });
}

export function useDeleteAddress(userId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.address.user(userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile(userId) });
      }
    },
  });
}
