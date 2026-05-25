import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function ProductCard({ product }) {
  const { _id, name, image, price, rating, discount, countInStock } = product;
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    const cartItem = {
      product: _id,
      name,
      image,
      price,
      amount: 1,
      discount,
    };
    addToCart(cartItem, user?._id);
    toast.success(`Đã thêm ${name} vào giỏ hàng`);
  };

  const finalPrice = price * (1 - discount / 100);

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg border-muted/50">
      <Link to={`/product-details/${_id}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden bg-white">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            />
            {discount > 0 && (
              <Badge className="absolute left-2 top-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0">
                -{discount}%
              </Badge>
            )}
            {countInStock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px] text-sm font-black text-muted-foreground uppercase">
                Hết hàng
              </div>
            )}
          </div>
        </CardHeader>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product-details/${_id}`} className="hover:text-primary transition-colors">
          <h3 className="line-clamp-2 min-h-[2.5rem] font-bold text-sm leading-tight">{name}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} 
              />
            ))}
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground">({rating})</span>
        </div>
        <div className="mt-3 flex flex-col">
          <span className="text-lg font-black text-primary">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(finalPrice)}
          </span>
          {discount > 0 && (
            <span className="text-[10px] text-muted-foreground line-through opacity-60">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          size="sm"
          className="w-full gap-2 font-bold h-9 text-xs" 
          disabled={countInStock === 0}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  );
}
