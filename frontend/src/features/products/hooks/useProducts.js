import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

export const useProducts = (search = "", limit = 12, page = 0) => {
  return useQuery({
    queryKey: ["products", search, limit, page],
    queryFn: () => productService.getAllProducts(search, limit, page),
    placeholderData: (previousData) => previousData,
  });
};

export const useProductTypes = () => {
  return useQuery({
    queryKey: ["product-types"],
    queryFn: () => productService.getAllTypes(),
  });
};

export const useProductDetails = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductDetails(id),
    enabled: !!id,
  });
};
