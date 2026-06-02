import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "@/api/wishlist.api";

export function useWishlist(options = {}) {
  const query = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistApi.getWishlist(),
    select: (response) => response?.data || [],
    ...options,
  });
  return {
    ...query,
    wishlist: query.data || [],
  };
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => wishlistApi.toggleWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}
