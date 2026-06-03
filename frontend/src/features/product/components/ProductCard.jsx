import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createProductSlug } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatter";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "@/components/ui/sonner";
import { useWishlist, useToggleWishlist } from "@/hooks/api/useWishlist";

export function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { wishlist } = useWishlist({ enabled: isAuthenticated });
  const toggleWishlistMutation = useToggleWishlist();

  const isLiked = wishlist.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart.`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to manage your wishlist.");
      navigate("/login");
      return;
    }

    toggleWishlistMutation.mutate(product._id, {
      onSuccess: () => {
        if (isLiked) {
          toast.success(`${product.name} removed from wishlist.`);
        } else {
          toast.success(`${product.name} added to wishlist.`);
        }
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to update wishlist.");
      },
    });
  };

  return (
    <motion.div whileHover={{ y: -6 }}>
      <Card className="h-full overflow-hidden">
        <CardContent className="flex h-full flex-col p-0">
          <div className="relative overflow-hidden group">
            <Link to={`/product/${createProductSlug(product)}`} className="block">
              <img
                src={product.image}
                alt={product.name}
                className="h-56 w-full object-cover transition duration-500 hover:scale-105"
              />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 z-10 h-9 w-9 rounded-full bg-background/80 shadow-md backdrop-blur-sm transition hover:bg-background hover:scale-105"
              onClick={handleToggleWishlist}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                }`}
              />
            </Button>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{product.type}</Badge>
              <div className="flex items-center gap-1 text-sm text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                {product.rating}
              </div>
            </div>
            <div className="space-y-2">
              <Link to={`/product/${createProductSlug(product)}`} className="text-lg font-bold leading-tight hover:text-primary">
                {product.name}
              </Link>
              <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
            </div>
            <div className="mt-auto flex items-center justify-between gap-3">
              <div>
                <p className="text-xl font-extrabold">{formatCurrency(product.price)}</p>
                <p className="text-xs text-muted-foreground">{product.countInStock} in stock</p>
              </div>
              <Button onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
