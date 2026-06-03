import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { queryKeys } from "@/config/constants";

export function useProfile(userId) {
  return useQuery({
    queryKey: [...queryKeys.authUser, userId],
    queryFn: () => authApi.getProfile(userId),
    enabled: Boolean(userId),
    select: (response) => response?.data || null,
  });
}

export function useUpdateProfile(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => authApi.updateProfile(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.authUser, userId] });
    },
  });
}
