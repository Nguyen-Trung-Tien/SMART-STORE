import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/product.api";
import { queryKeys } from "@/lib/queryKeys";

const QUERY_RETRY_LIMIT = 2;

function normalizeParams(params = {}) {
  return {
    page: Math.max(Number(params.page) || 1, 1),
    limit: Math.max(Number(params.limit) || 12, 1),
    search: params.search || "",
    category: params.category || "",
    sort: params.sort || "",
    featured: params.featured,
  };
}

function shouldRetry(failureCount, error) {
  if ([401, 403, 404].includes(error?.statusCode)) {
    return false;
  }

  return failureCount < QUERY_RETRY_LIMIT;
}

function mapProductListResponse(response) {
  const items = response?.data || [];
  const pagination = response?.pagination || {
    page: 1,
    limit: items.length,
    total: items.length,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return {
    items,
    pagination,
    total: pagination.total || items.length,
    totalPages: pagination.totalPages || 1,
    hasNextPage: pagination.hasNextPage || false,
    hasPrevPage: pagination.hasPrevPage || false,
  };
}

export function useProducts(params = {}) {
  const normalizedParams = normalizeParams(params);

  const query = useQuery({
    queryKey: queryKeys.products.list(normalizedParams),
    queryFn: () => getProducts(normalizedParams),
    placeholderData: keepPreviousData,
    retry: shouldRetry,
    staleTime: 60000,
    select: mapProductListResponse,
  });

  return {
    ...query,
    products: query.data?.items || [],
    pagination: query.data?.pagination || null,
  };
}

export function useInfiniteProducts(params = {}) {
  const normalizedParams = normalizeParams(params);

  return useInfiniteQuery({
    queryKey: queryKeys.products.infinite(normalizedParams),
    initialPageParam: normalizedParams.page,
    queryFn: ({ pageParam }) =>
      getProducts({
        ...normalizedParams,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      return pagination?.hasNextPage ? pagination.page + 1 : undefined;
    },
    retry: shouldRetry,
    staleTime: 60000,
    select: (data) => ({
      ...data,
      pages: data.pages.map(mapProductListResponse),
      items: data.pages.flatMap((page) => page?.data || []),
    }),
  });
}
