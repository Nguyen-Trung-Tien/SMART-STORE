import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Home, 
  ArrowLeft, 
  ShoppingBag, 
  Search, 
  ChevronRight, 
  Sparkles,
  PackageOpen,
  Compass
} from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

const cubicBezier = [0.32, 0.72, 0, 1];

export default function NotFoundPage() {
  const { data: productsData, isLoading } = useProducts("", 4);
  const products = productsData?.data || [];

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] dark:bg-[#050505] flex flex-col items-center pt-20 pb-24 px-6 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Visual Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: cubicBezier }}
          className="relative mb-12"
        >
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-white dark:bg-neutral-900 border ring-1 ring-black/5 shadow-2xl"
          >
            <PackageOpen className="h-14 w-14 text-primary/60" />
            <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg animate-pulse">
               <Sparkles className="h-4 w-4" />
            </div>
          </motion.div>
          
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
             <span className="text-7xl md:text-8xl font-black tracking-tighter text-primary/10 select-none">404</span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: cubicBezier }}
          className="space-y-4 mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-black tracking-tight italic uppercase">Trang không tồn tại</h1>
          <p className="max-w-md mx-auto text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
            Có vẻ như "món đồ" công nghệ bạn đang tìm kiếm đã rời khỏi kệ hàng hoặc chuyển sang một vị trí mới tinh tế hơn.
          </p>
        </motion.div>

        {/* Search Context */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: cubicBezier }}
          className="w-full max-w-md mb-12"
        >
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
              <Input 
                 placeholder="Tìm kiếm siêu phẩm khác..." 
                 className="h-12 pl-11 pr-32 rounded-xl bg-white dark:bg-neutral-900 border-2 border-transparent focus-visible:border-primary/20 shadow-sm transition-all text-xs font-bold"
              />
              <Button className="absolute right-1 top-1 h-10 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest">
                 Tìm ngay
              </Button>
           </div>
        </motion.div>

        {/* Main Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: cubicBezier }}
          className="flex flex-wrap items-center justify-center gap-4 mb-24"
        >
          <Button size="lg" asChild className="h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">
            <Link to="/">
              <Home className="mr-2 h-3.5 w-3.5" /> Về trang chủ
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-12 px-8 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
            <Link to="/products">
               <ShoppingBag className="mr-2 h-3.5 w-3.5" /> Tiếp tục mua sắm
            </Link>
          </Button>
        </motion.div>

        {/* Recommendations */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full space-y-10"
        >
          <div className="flex items-end justify-between px-2 border-b border-black/5 pb-4">
            <div className="space-y-1 flex flex-col items-start">
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">Gợi ý dành riêng cho bạn</span>
               <h2 className="text-xl md:text-2xl font-black tracking-tight italic">Khám phá xu hướng mới</h2>
            </div>
            <Link to="/products" className="text-[9px] font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1.5 group">
               Xem tất cả <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {isLoading ? (
               Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
               ))
            ) : (
               products.map((p) => (
                 <ProductCard key={p._id} product={p} />
               ))
            )}
          </div>
        </motion.section>

        {/* Bottom Context */}
        <div className="mt-24 flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
           <span className="flex items-center gap-2"><Compass className="h-3 w-3" /> Bản đồ trang</span>
           <div className="h-1 w-1 rounded-full bg-current" />
           <span className="flex items-center gap-2">Hỗ trợ 24/7</span>
           <div className="h-1 w-1 rounded-full bg-current" />
           <span className="flex items-center gap-2">Báo lỗi</span>
        </div>
      </div>
    </div>
  );
}
