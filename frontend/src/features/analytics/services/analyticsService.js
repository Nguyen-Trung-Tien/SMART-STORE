import { api } from "@/lib/api";

export const analyticsService = {
  getDashboardStats: () => {
    return api.get("/analytics/stats");
  },
};
