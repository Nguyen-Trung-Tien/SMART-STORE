import { useQuery } from "@tanstack/react-query";
import { getProductById, getProductBySlug } from "@/api/product.api";
import { queryKeys } from "@/lib/queryKeys";

function shouldRetry(failureCount, error) {
  if ([401, 403, 404].includes(error?.statusCode)) {
    return false;
  }

  return failureCount < 2;
}

export function useProduct(slug) {
  const query = useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug),
    retry: shouldRetry,
    staleTime: 60000,
    select: (response) => response?.data || null,
  });

  return {
    ...query,
    product: query.data || null,
  };
}

export function useProductById(productId) {
  const query = useQuery({
    queryKey: queryKeys.products.byId(productId),
    queryFn: () => getProductById(productId),
    enabled: Boolean(productId),
    retry: shouldRetry,
    staleTime: 60000,
    select: (response) => response?.data || null,
  });

  return {
    ...query,
    product: query.data || null,
  };
}
