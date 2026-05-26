import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../services/reviewService";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export const useReviews = (productId) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewService.getReviews(productId),
    enabled: !!productId,
  });
};

export const useCreateReview = (productId) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: (data) => reviewService.createReview({ ...data, product: productId }),
    onSuccess: (data) => {
      if (data.status === "OK") {
        toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
        queryClient.invalidateQueries(["reviews", productId]);
        queryClient.invalidateQueries(["product", productId]);
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi gửi đánh giá");
      }
    },
    onError: (error) => {
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để đánh giá sản phẩm");
      } else {
        toast.error(error.message || "Có lỗi xảy ra khi gửi đánh giá");
      }
    }
  });
};
