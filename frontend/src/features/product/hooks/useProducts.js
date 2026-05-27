import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/api/product.api";
import { queryKeys } from "@/config/constants";

export function useProducts(params) {
  return useQuery({
    queryKey: [...queryKeys.products, params],
    queryFn: () => productApi.list(params),
    select: (response) => ({
      items: response?.data || [],
      total: response?.total || response?.data?.length || 0,
    }),
  });
}

export function useProductDetail(id) {
  return useQuery({
    queryKey: queryKeys.productDetail(id),
    queryFn: () => productApi.detail(id),
    enabled: Boolean(id),
    select: (response) => response?.data || null,
  });
}

export function useAdminProductMutations() {
  const queryClient = useQueryClient();

  const invalidateProducts = () => queryClient.invalidateQueries({ queryKey: queryKeys.products });

  const createProduct = useMutation({
    mutationFn: productApi.create,
    onSuccess: invalidateProducts,
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, payload }) => productApi.update(id, payload),
    onSuccess: invalidateProducts,
  });

  const deleteProduct = useMutation({
    mutationFn: productApi.remove,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products });
      const snapshots = queryClient.getQueriesData({ queryKey: queryKeys.products });

      snapshots.forEach(([key, value]) => {
        if (!value) {
          return;
        }

        queryClient.setQueryData(key, {
          ...value,
          items: value.items.filter((item) => item._id !== productId),
        });
      });

      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      context?.snapshots?.forEach(([key, value]) => queryClient.setQueryData(key, value));
    },
    onSettled: invalidateProducts,
  });

  return { createProduct, updateProduct, deleteProduct };
}
