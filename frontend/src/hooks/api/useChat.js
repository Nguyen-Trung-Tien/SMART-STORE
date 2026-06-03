import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/api/chat.api";
import { queryKeys } from "@/lib/queryKeys";

export function useChatHistory(userId) {
  const query = useQuery({
    queryKey: queryKeys.chat.history(userId),
    queryFn: () => chatApi.getChatHistory(userId),
    enabled: !!userId,
  });

  return {
    ...query,
    messages: query.data?.data || [],
  };
}

export function useActiveChats() {
  const query = useQuery({
    queryKey: queryKeys.chat.active,
    queryFn: () => chatApi.getActiveChats(),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  return {
    ...query,
    activeChats: query.data?.data || [],
  };
}

export function useMarkChatAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: chatApi.markAsRead,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.active });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.history(userId) });
    },
  });
}
