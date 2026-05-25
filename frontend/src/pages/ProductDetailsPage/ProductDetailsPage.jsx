import { useParams, Link } from "react-router-dom";
import { useProductDetails } from "@/features/products/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Star, 
  ShoppingCart, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Minus,
  Plus,
  Heart,
  Share2,
  Check,
  Info,
  ArrowRight
} from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const cubicBezier = [0.32, 0.72, 0, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: cubicBezier
    }
  }
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: productData, isLoading } = useProductDetails(id);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const product = productData?.data;

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      amount: quantity,
      discount: product.discount,
    };
    addToCart(cartItem, user?._id);
    toast.success(`Đã thêm vào giỏ hàng`, {
      description: product.name,
      icon: <div className="bg-emerald-500 rounded-full p-1"><Check className="h-3 w-3 text-white" /></div>,
      className: "rounded-2xl border-none shadow-2xl"
    });
  };

  const finalPrice = product ? product.price * (1 - product.discount / 100) : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="grid gap-20 lg:grid-cols-2">
           <Skeleton className="aspect-square w-full rounded-[3rem]" />
           <div className="space-y-10">
              <div className="space-y-4">
                 <Skeleton className="h-6 w-20 rounded-full" />
                 <Skeleton className="h-14 w-full" />
                 <Skeleton className="h-6 w-1/4" />
              </div>
              <Skeleton className="h-24 w-full rounded-3xl" />
              <div className="flex gap-4">
                 <Skeleton className="h-14 flex-1 rounded-2xl" />
                 <Skeleton className="h-14 flex-1 rounded-2xl" />
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="rounded-[3rem] bg-muted/30 p-12 mb-8">
          <Info className="h-20 w-20 text-muted-foreground/50" />
        </div>
        <h2 className="text-4xl font-black tracking-tight mb-4">Tuyệt bản rồi!</h2>
        <p className="text-muted-foreground max-w-sm mb-10 text-lg">Sản phẩm này hiện không còn trong kho báu của chúng tôi.</p>
        <Button asChild size="lg" className="rounded-full px-12 h-14 font-bold shadow-xl shadow-primary/20 transition-transform active:scale-95">
          <Link to="/products">Khám phá sản phẩm khác <ArrowRight className="ml-2 h-5 w-5" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] dark:bg-[#050505]">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container relative z-10 mx-auto px-6 py-8 md:py-16">
        {/* Breadcrumbs */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12"
        >
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
          <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </motion.nav>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-16 lg:grid-cols-2 items-start"
        >
          {/* Product Gallery (The Double-Bezel) */}
          <motion.div variants={fadeUpVariants} className="lg:sticky lg:top-32">
            <div className="group relative rounded-[3.5rem] bg-black/5 dark:bg-white/5 p-2 ring-1 ring-black/5 dark:ring-white/10 transition-all duration-700 hover:ring-primary/20 shadow-2xl shadow-black/5">
              <div className="relative aspect-square overflow-hidden rounded-[calc(3.5rem-0.5rem)] bg-white dark:bg-neutral-950 flex items-center justify-center p-12 md:p-20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <motion.img 
                  layoutId={`product-image-${product._id}`}
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-contain transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Floating Actions */}
                <div className="absolute right-8 top-8 flex flex-col gap-4">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className={cn("h-12 w-12 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl shadow-2xl transition-all hover:scale-110 active:scale-90", isLiked && "text-destructive")}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-12 w-12 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl shadow-2xl transition-all hover:scale-110 active:scale-90"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {product.discount > 0 && (
                  <div className="absolute left-0 top-12 rounded-r-3xl bg-primary px-8 py-3 text-lg font-black text-primary-foreground shadow-2xl shadow-primary/20">
                    -{product.discount}%
                  </div>
                )}
                
                {product.countInStock === 0 && (
                   <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-md">
                      <span className="rounded-full bg-neutral-900 px-10 py-4 text-xl font-black uppercase tracking-widest text-white ring-8 ring-white/10">Sold Out</span>
                   </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Product Details (The Editorial Split) */}
          <motion.div variants={fadeUpVariants} className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 border-none">
                  {product.type}
                </Badge>
                {product.countInStock > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-balance">{product.name}</h1>
              
              <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">
                <div className="flex items-center gap-2 text-yellow-500">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-3.5 w-3.5", i < product.rating ? "fill-current" : "opacity-20")} />
                    ))}
                  </div>
                  <span className="text-foreground">{product.rating}</span>
                </div>
                <div className="h-4 w-px bg-muted-foreground/20" />
                <span className="hover:text-primary transition-colors cursor-pointer">48 Reviews</span>
                <div className="h-4 w-px bg-muted-foreground/20" />
                <span>1.2k+ Sold</span>
              </div>
            </div>

            {/* Price Architecture */}
            <div className="relative rounded-[2.5rem] bg-white dark:bg-neutral-900 p-10 ring-1 ring-black/5 dark:ring-white/10 shadow-2xl shadow-black/5 overflow-hidden group">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors duration-1000" />
              
              <div className="relative z-10 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Current Price</span>
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-primary tracking-tighter">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(finalPrice)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-2xl text-muted-foreground/40 line-through font-bold">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold w-fit">
                   <ShieldCheck className="h-3.5 w-3.5" /> Price includes global warranty & insurance
                </div>
              </div>
            </div>

            {/* Selection & CTA */}
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Quantity</h3>
                   <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">{product.countInStock} available</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center rounded-2xl border-2 border-black/5 dark:border-white/5 bg-background p-1.5 shadow-inner">
                    <Button 
                      variant="ghost" size="icon" 
                      className="h-10 w-10 rounded-xl hover:bg-muted transition-transform active:scale-75" 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-16 text-center text-xl font-black tabular-nums">{quantity}</span>
                    <Button 
                      variant="ghost" size="icon" 
                      className="h-10 w-10 rounded-xl hover:bg-muted transition-transform active:scale-75" 
                      onClick={() => setQuantity(q => Math.min(product.countInStock, q + 1))}
                      disabled={quantity >= product.countInStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <Button 
                  size="lg" 
                  className="group h-16 flex-[1.5] gap-4 text-lg font-black rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden" 
                  onClick={handleAddToCart} 
                  disabled={product.countInStock === 0}
                >
                  <ShoppingCart className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /> 
                  Thêm vào giỏ
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button 
                  size="lg" variant="outline" 
                  className="h-16 flex-1 border-2 border-black/10 dark:border-white/10 text-lg font-black rounded-2xl transition-all hover:border-primary hover:text-primary active:scale-[0.98]" 
                  asChild disabled={product.countInStock === 0}
                >
                  <Link to="/checkout">Mua ngay</Link>
                </Button>
              </div>
            </div>

            {/* Trust Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-black/5 dark:border-white/5 pt-10">
              {[
                { icon: ShieldCheck, label: "Bảo hành", sub: "24 tháng", color: "text-primary bg-primary/10" },
                { icon: Truck, label: "Miễn phí", sub: "Vận chuyển", color: "text-blue-500 bg-blue-500/10" },
                { icon: RotateCcw, label: "Đổi trả", sub: "7 ngày", color: "text-orange-500 bg-orange-500/10" }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3 p-6 rounded-[2rem] bg-white dark:bg-neutral-900/50 ring-1 ring-black/5 dark:ring-white/5 transition-transform hover:-translate-y-1">
                  <div className={cn("rounded-2xl p-3 shadow-inner", badge.color)}>
                    <badge.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">{badge.label}</h4>
                    <p className="text-[11px] font-bold text-muted-foreground">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* The Specification Grid (Fix for the Table issue) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: cubicBezier }}
          className="mt-32"
        >
          <Tabs defaultValue="description" className="w-full">
            <div className="flex justify-center mb-16">
              <TabsList className="bg-black/5 dark:bg-white/5 h-auto p-1.5 rounded-[2rem] gap-2 ring-1 ring-black/5 dark:ring-white/10">
                {["description", "specifications", "reviews"].map((tab) => (
                  <TabsTrigger 
                    key={tab}
                    value={tab} 
                    className="rounded-full px-8 py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:text-primary data-[state=active]:shadow-2xl font-black uppercase tracking-[0.15em] text-[10px] text-muted-foreground/60 transition-all"
                  >
                    {tab === "description" && "Mô tả"}
                    {tab === "specifications" && "Thông số"}
                    {tab === "reviews" && "Đánh giá"}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <AnimatePresence mode="wait">
              <TabsContent value="description" className="focus-visible:outline-none outline-none">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="max-w-4xl mx-auto prose dark:prose-invert prose-lg md:prose-xl"
                >
                  <p className="text-muted-foreground leading-[1.8] whitespace-pre-line text-balance text-center md:text-left first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:mt-2">
                    {product.description || "Chúng tôi đang cập nhật những thông tin tinh hoa nhất cho sản phẩm này. Trải nghiệm đỉnh cao đang chờ đợi bạn khám phá."}
                  </p>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="specifications" className="focus-visible:outline-none outline-none">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="rounded-[3rem] bg-white dark:bg-neutral-900 p-2 ring-1 ring-black/5 dark:ring-white/10 shadow-2xl">
                    <div className="overflow-hidden rounded-[calc(3rem-0.5rem)] border border-black/5 dark:border-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black/5 dark:divide-white/5">
                        {[
                          { label: "Thương hiệu", value: product.type },
                          { label: "Model", value: product.name.split(' ').slice(-2).join(' ') },
                          { label: "Bảo hành", value: "24 Tháng tận nơi" },
                          { label: "Tình trạng", value: "Fullbox / Seal" },
                          { label: "Vận chuyển", value: "Toàn quốc 0đ" },
                          { label: "Chất lượng", value: "Chính hãng 100%" }
                        ].map((row, i) => (
                          <div key={i} className={cn("flex flex-col gap-1 px-10 py-8 transition-colors hover:bg-primary/5 group")}>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary transition-colors">{row.label}</span>
                            <span className="text-lg font-bold tracking-tight">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="reviews" className="focus-visible:outline-none outline-none">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-5xl mx-auto grid gap-12 lg:grid-cols-3 items-center"
                >
                   <div className="lg:col-span-1 rounded-[3rem] bg-white dark:bg-neutral-900 p-12 ring-1 ring-black/5 dark:ring-white/10 shadow-2xl flex flex-col items-center justify-center text-center">
                      <span className="text-8xl font-black text-primary tracking-tighter">{product.rating}</span>
                      <div className="flex my-6 text-yellow-500 scale-125">
                         {Array.from({ length: 5 }).map((_, i) => (
                           <Star key={i} className={cn("h-6 w-6", i < product.rating ? "fill-current" : "opacity-20")} />
                         ))}
                      </div>
                      <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Based on 1.2k experiences</p>
                   </div>
                   <div className="lg:col-span-2 flex flex-col items-center justify-center py-20 px-12 text-center border-4 border-dashed border-black/5 dark:border-white/5 rounded-[3.5rem] bg-muted/5 transition-colors hover:border-primary/20">
                      <div className="rounded-full bg-white dark:bg-neutral-900 p-6 shadow-2xl mb-6 ring-1 ring-black/5 dark:ring-white/10">
                         <Star className="h-10 w-10 text-yellow-400 animate-pulse" />
                      </div>
                      <h3 className="text-2xl font-black tracking-tight mb-3">Be the voice of authority</h3>
                      <p className="text-muted-foreground max-w-sm text-lg font-medium leading-relaxed">Your perspective defines our standard. Share your experience with the community.</p>
                      <Button variant="outline" className="mt-10 rounded-full px-12 h-14 font-black border-2 border-black/10 dark:border-white/10 hover:border-primary hover:text-primary transition-all active:scale-95 uppercase tracking-widest text-[10px]">
                        Write a review
                      </Button>
                   </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>

      {/* Floating Sticky Mobile Bar (Haptic Design) */}
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-6 right-6 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10 p-3 rounded-[2rem] flex items-center justify-between gap-4 md:hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        >
          <div className="pl-4 flex flex-col">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Price</span>
            <span className="text-xl font-black text-primary tracking-tighter">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(finalPrice)}
            </span>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="h-12 w-12 rounded-2xl border-2 border-black/5 dark:border-white/5" onClick={handleAddToCart}>
               <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button className="h-12 px-8 font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95" asChild>
               <Link to="/checkout">Buy Now</Link>
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
