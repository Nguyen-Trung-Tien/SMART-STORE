import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { createProduct, deleteProduct, updateProduct } from "@/api/product.api";
import { queryKeys } from "@/lib/queryKeys";

function patchProductLists(queryClient, updater) {
  const snapshots = queryClient.getQueriesData({
    queryKey: queryKeys.products.lists(),
  });

  snapshots.forEach(([queryKey, currentValue]) => {
    if (!currentValue) {
      return;
    }

    queryClient.setQueryData(queryKey, updater(currentValue));
  });

  return snapshots;
}

export function useCreateProduct(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.products.lists(),
      });

      const optimisticProduct = {
        ...payload,
        _id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      const snapshots = patchProductLists(queryClient, (currentValue) => {
        if (!currentValue?.items?.length && currentValue?.pagination?.page !== 1) {
          return currentValue;
        }

        const limit = currentValue?.pagination?.limit || currentValue?.items?.length || 12;
        const nextItems = [optimisticProduct, ...(currentValue?.items || [])].slice(0, limit);
        const nextTotal = (currentValue?.total || 0) + 1;

        return {
          ...currentValue,
          items: nextItems,
          total: nextTotal,
          pagination: currentValue.pagination
            ? {
                ...currentValue.pagination,
                total: nextTotal,
              }
            : currentValue.pagination,
        };
      });

      return { snapshots };
    },
    onError: (error, _variables, context) => {
      context?.snapshots?.forEach(([queryKey, snapshot]) => {
        queryClient.setQueryData(queryKey, snapshot);
      });

      toast.error(error.message || "Failed to create product.");
      options.onError?.(error);
    },
    onSuccess: (response, variables, context) => {
      toast.success(response.message || "Product created successfully.");
      options.onSuccess?.(response, variables, context);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.products.lists(),
      });
    },
  });
}

export function useUpdateProduct(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.products.lists(),
      });

      const snapshots = patchProductLists(queryClient, (currentValue) => ({
        ...currentValue,
        items: (currentValue?.items || []).map((item) => (item._id === id ? { ...item, ...payload } : item)),
      }));

      const detailSnapshot = queryClient.getQueryData(queryKeys.products.byId(id));

      if (detailSnapshot) {
        queryClient.setQueryData(queryKeys.products.byId(id), {
          ...detailSnapshot,
          ...payload,
        });
      }

      return { snapshots, detailSnapshot, id };
    },
    onError: (error, _variables, context) => {
      context?.snapshots?.forEach(([queryKey, snapshot]) => {
        queryClient.setQueryData(queryKey, snapshot);
      });

      if (context?.detailSnapshot) {
        queryClient.setQueryData(queryKeys.products.byId(context.id), context.detailSnapshot);
      }

      toast.error(error.message || "Failed to update product.");
      options.onError?.(error);
    },
    onSuccess: (response, variables, context) => {
      const product = response?.data;

      if (product?._id) {
        queryClient.setQueryData(queryKeys.products.byId(product._id), product);
        if (product.slug) {
          queryClient.setQueryData(queryKeys.products.detail(product.slug), product);
        }
      }

      toast.success(response.message || "Product updated successfully.");
      options.onSuccess?.(response, variables, context);
    },
    onSettled: async (_response, _error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.products.lists(),
      });

      if (variables?.id) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.products.byId(variables.id),
        });
      }
    },
  });
}

export function useDeleteProduct(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.products.lists(),
      });

      const snapshots = patchProductLists(queryClient, (currentValue) => {
        const nextItems = (currentValue?.items || []).filter((item) => item._id !== productId);
        const nextTotal = Math.max((currentValue?.total || 1) - 1, 0);

        return {
          ...currentValue,
          items: nextItems,
          total: nextTotal,
          pagination: currentValue.pagination
            ? {
                ...currentValue.pagination,
                total: nextTotal,
              }
            : currentValue.pagination,
        };
      });

      return { snapshots };
    },
    onError: (error, _variables, context) => {
      context?.snapshots?.forEach(([queryKey, snapshot]) => {
        queryClient.setQueryData(queryKey, snapshot);
      });

      toast.error(error.message || "Failed to delete product.");
      options.onError?.(error);
    },
    onSuccess: (response, variables, context) => {
      toast.success(response.message || "Product deleted successfully.");
      options.onSuccess?.(response, variables, context);
    },
    onSettled: async (_response, _error, productId) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.products.lists(),
      });

      if (productId) {
        queryClient.removeQueries({
          queryKey: queryKeys.products.byId(productId),
        });
      }
    },
  });
}
