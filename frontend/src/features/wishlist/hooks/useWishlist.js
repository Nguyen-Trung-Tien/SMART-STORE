import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "../services/wishlistService";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export const useWishlist = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistService.getWishlist(),
    enabled: isAuthenticated,
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: (productId) => wishlistService.toggleWishlist(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["wishlist"]);
      if (data.message === "Added to wishlist") {
        toast.success("Đã thêm vào danh sách yêu thích");
      } else {
        toast.success("Đã xóa khỏi danh sách yêu thích");
      }
    },
    onError: () => {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
    }
  });
};
