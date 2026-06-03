import { useCreateProduct, useDeleteProduct, useUpdateProduct } from "@/hooks/api/useCreateProduct";
import { useProductById } from "@/hooks/api/useProduct";
import { useProducts as useProductsQuery } from "@/hooks/api/useProducts";

export function useProducts(params) {
  return useProductsQuery(params);
}

export function useProductDetail(id) {
  return useProductById(id);
}

export function useAdminProductMutations() {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  return {
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
