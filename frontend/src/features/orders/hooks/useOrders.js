import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/orderService";

export const useUserOrders = (userId) => {
  return useQuery({
    queryKey: ["user-orders", userId],
    queryFn: () => orderService.getOrdersByUser(userId),
    enabled: !!userId,
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ["all-orders"],
    queryFn: () => orderService.getAllOrders(),
  });
};
