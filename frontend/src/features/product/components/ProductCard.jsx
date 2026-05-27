import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createProductSlug } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatter";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "@/components/ui/sonner";

export function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart.`);
  };

  return (
    <motion.div whileHover={{ y: -6 }}>
      <Card className="h-full overflow-hidden">
        <CardContent className="flex h-full flex-col p-0">
          <Link to={`/product/${createProductSlug(product)}`} className="block overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="h-56 w-full object-cover transition duration-500 hover:scale-105"
            />
          </Link>
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
