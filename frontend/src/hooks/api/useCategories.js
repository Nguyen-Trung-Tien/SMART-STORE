import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/category.api";
import { queryKeys } from "@/lib/queryKeys";

export function useCategories(params = {}) {
  return useQuery({
    queryKey: queryKeys.categories.list(params),
    queryFn: () => getCategories(params),
    retry: (failureCount, error) => ![401, 403, 404].includes(error?.statusCode) && failureCount < 2,
    staleTime: 60000,
    select: (response) => response?.data || [],
  });
}
