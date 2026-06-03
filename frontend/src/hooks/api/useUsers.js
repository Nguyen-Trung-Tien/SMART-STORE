import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/users.api";
import { queryKeys } from "@/lib/queryKeys";

export function useUsers(params = {}) {
  const query = useQuery({
    queryKey: queryKeys.users.list,
    queryFn: () => usersApi.getUsers(params),
  });

  return {
    ...query,
    users: query.data?.data || [],
  };
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useChangeRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => usersApi.changeRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
