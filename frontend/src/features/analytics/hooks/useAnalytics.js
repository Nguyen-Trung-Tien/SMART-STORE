import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analyticsService";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => analyticsService.getDashboardStats(),
  });
};
