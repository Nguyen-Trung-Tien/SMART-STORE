import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/api/review.api";
import { queryKeys } from "@/lib/queryKeys";

export function useProductReviews(productId) {
  const query = useQuery({
    queryKey: queryKeys.reviews.product(productId),
    queryFn: () => reviewApi.getProductReviews(productId),
    enabled: !!productId,
  });

  return {
    ...query,
    reviews: query.data?.data || [],
  };
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewApi.createReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.product(variables.product) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.byId(variables.product) });
    },
  });
}

export function useAllReviews(params = {}) {
  const query = useQuery({
    queryKey: ["reviews", "all-admin", params],
    queryFn: () => reviewApi.getAllReviews(params),
  });

  return {
    ...query,
    reviews: query.data?.data || [],
  };
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => reviewApi.updateReviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewApi.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
