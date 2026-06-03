import { apiClient } from "@/api/axios";

export function getChatHistory(userId) {
  return apiClient.get("/chat/history", { params: { userId } });
}

export function getActiveChats() {
  return apiClient.get("/chat/active");
}

export function markAsRead(userId) {
  return apiClient.post("/chat/mark-read", { userId });
}

export const chatApi = {
  getChatHistory,
  getActiveChats,
  markAsRead,
};
