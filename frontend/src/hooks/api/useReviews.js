import { useQuery } from "@tanstack/react-query";
import { getProductReviews } from "@/api/review.api";
import { queryKeys } from "@/lib/queryKeys";

function shouldRetry(failureCount, error) {
  if ([401, 403, 404].includes(error?.statusCode)) {
    return false;
  }

  return failureCount < 2;
}

export function useProductReviews(productId) {
  const query = useQuery({
    queryKey: queryKeys.reviews.product(productId),
    queryFn: () => getProductReviews(productId),
    enabled: Boolean(productId),
    retry: shouldRetry,
    staleTime: 60000,
    select: (response) => response?.data || [],
  });

  return {
    ...query,
    reviews: query.data || [],
  };
}
