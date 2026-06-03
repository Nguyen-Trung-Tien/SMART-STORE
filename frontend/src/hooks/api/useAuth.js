import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { forgotPassword, getProfile, login, logoutUser, refreshToken, register, resetPassword, updateProfile } from "@/api/auth.api";
import { queryKeys } from "@/lib/queryKeys";

export function useProfile(userId) {
  return useQuery({
    queryKey: queryKeys.auth.profile(userId),
    queryFn: () => getProfile(userId),
    enabled: Boolean(userId),
    staleTime: 30000,
    select: (response) => response?.data || null,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: refreshToken,
  });
}

export function useUpdateProfile(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => updateProfile(userId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile(userId) }),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logoutUser,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}
