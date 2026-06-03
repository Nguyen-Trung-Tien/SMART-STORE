import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, getCategoryDetails, createCategory, updateCategory, deleteCategory } from "@/api/category.api";
import { queryKeys } from "@/lib/queryKeys";

export function useCategories(params = {}) {
  const query = useQuery({
    queryKey: queryKeys.categories.list(params),
    queryFn: () => getCategories(params),
  });

  return {
    ...query,
    categories: query.data?.data || [],
  };
}

export function useCategory(id) {
  const query = useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => getCategoryDetails(id),
    enabled: !!id,
  });

  return {
    ...query,
    category: query.data?.data || null,
  };
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(variables.id) });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}
