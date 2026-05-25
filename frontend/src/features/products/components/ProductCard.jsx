import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const cubicBezier = [0.32, 0.72, 0, 1];

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
    toast.success(`Added to collection`, {
      description: name,
      duration: 2000,
      className: "rounded-2xl border-none shadow-2xl bg-white dark:bg-neutral-900"
    });
  };

  const finalPrice = price * (1 - discount / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: cubicBezier }}
      className="h-full"
    >
      <Card className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border-none bg-black/5 dark:bg-white/5 p-1.5 shadow-sm transition-all hover:shadow-2xl hover:shadow-primary/10 ring-1 ring-black/5 dark:ring-white/10">
        <Link to={`/product-details/${_id}`} className="flex flex-1 flex-col overflow-hidden rounded-[calc(2rem-0.375rem)] bg-white dark:bg-neutral-950">
          <CardHeader className="p-0">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F9F9F9] dark:bg-neutral-900/50">
              <img
                src={image}
                alt={name}
                className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay Actions */}
              <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-4 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl shadow-xl hover:scale-110 transition-transform">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              {discount > 0 && (
                <div className="absolute left-0 top-4 z-10 rounded-r-xl bg-primary px-3 py-1 text-[10px] font-black text-primary-foreground shadow-lg">
                  -{discount}%
                </div>
              )}

              {countInStock === 0 && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/40 backdrop-blur-[2px]">
                  <span className="rounded-full bg-neutral-900 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-white">Sold Out</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col p-4 pt-5">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-2.5 w-2.5 fill-current" />
                <span className="text-[10px] font-black">{rating}</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Premium</span>
            </div>

            <h3 className="line-clamp-2 flex-1 text-sm font-bold leading-tight tracking-tight text-neutral-800 dark:text-neutral-200 transition-colors group-hover:text-primary">
              {name}
            </h3>

            <div className="mt-4 flex flex-col">
              <span className="text-lg font-black text-primary tracking-tighter">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(finalPrice)}
              </span>
              {discount > 0 && (
                <span className="text-[10px] font-bold text-muted-foreground/40 line-through">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)}
                </span>
              )}
            </div>
          </CardContent>
        </Link>

        <CardFooter className="p-1.5">
          <Button 
            size="sm"
            onClick={handleAddToCart}
            disabled={countInStock === 0}
            className="w-full h-10 gap-2 rounded-[calc(2rem-1rem)] bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white font-black uppercase tracking-[0.15em] text-[9px] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/10"
          >
            <Plus className="h-3 w-3" /> Add to bag
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
