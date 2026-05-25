import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Info, 
  Heart, 
  ChevronRight, 
  Truck,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  RotateCcw,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/features/products/hooks/useProducts";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const cubicBezier = [0.32, 0.72, 0, 1];

// --- Sub-components ---

function FreeShippingProgress({ total }) {
  const threshold = 500000;
  const remaining = threshold - total;
  const progress = Math.min((total / threshold) * 100, 100);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-muted-foreground flex items-center gap-1.5">
           <Truck className="h-3 w-3" /> Miễn phí vận chuyển
        </span>
        {remaining > 0 ? (
          <span className="text-primary">Còn thiếu {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(remaining)}</span>
        ) : (
          <span className="text-emerald-500 flex items-center gap-1">
             <CheckCircle2 className="h-3 w-3" /> Đã đạt điều kiện
          </span>
        )}
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: cubicBezier }}
          className={cn("h-full transition-colors duration-500", progress >= 100 ? "bg-emerald-500" : "bg-primary")}
        />
      </div>
    </div>
  );
}

function CartItemCard({ item, updateQuantity, removeFromCart, userId, isSelected, onToggleSelect }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 md:gap-4"
    >
      <div className="flex-shrink-0 flex items-center justify-center p-2">
         <Checkbox 
            checked={isSelected} 
            onCheckedChange={() => onToggleSelect(item.product)}
            className="h-5 w-5 rounded-md border-black/10 dark:border-white/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
         />
      </div>

      <Card className={cn(
        "flex-1 group relative overflow-hidden bg-white dark:bg-neutral-900 border-black/5 dark:border-white/5 ring-1 transition-all",
        isSelected ? "ring-primary/40 shadow-md bg-primary/[0.02]" : "ring-black/5 dark:ring-white/10 shadow-sm hover:shadow-md"
      )}>
        <CardContent className="p-4 md:p-5 flex gap-4 md:gap-6">
          {/* Thumbnail */}
          <div className="h-24 w-24 md:h-28 md:w-28 flex-shrink-0 bg-muted/30 rounded-xl overflow-hidden ring-1 ring-black/5">
            <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
             <div className="space-y-1">
                <div className="flex justify-between items-start gap-2">
                   <Link to={`/product-details/${item.product}`} className="hover:text-primary transition-colors">
                      <h3 className="text-sm md:text-base font-bold truncate leading-tight">{item.name}</h3>
                   </Link>
                   <Button 
                      variant="ghost" size="icon" 
                      className="h-8 w-8 -mt-1 -mr-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full"
                      onClick={() => removeFromCart(item.product, userId)}
                   >
                      <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                   {item.type || "Công nghệ"} 
                   {item.variants && Object.entries(item.variants).map(([k, v]) => (
                     <span key={k} className="flex items-center gap-1.5 border-l pl-2 border-black/10 dark:border-white/10">
                        {k}: <span className="text-foreground">{v}</span>
                     </span>
                   ))}
                </p>
             </div>

             <div className="flex items-end justify-between pt-2">
                <div className="flex items-center rounded-lg border bg-white dark:bg-neutral-950 p-1 shadow-sm">
                  <Button 
                    variant="ghost" size="icon" className="h-7 w-7 rounded-md"
                    onClick={() => updateQuantity(item.product, item.amount - 1, userId)}
                    disabled={item.amount <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-xs font-black tabular-nums">{item.amount}</span>
                  <Button 
                    variant="ghost" size="icon" className="h-7 w-7 rounded-md"
                    onClick={() => updateQuantity(item.product, item.amount + 1, userId)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-base md:text-lg font-black tracking-tight text-primary">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * (1 - item.discount/100) * item.amount)}
                  </span>
                  {item.discount > 0 && (
                    <span className="text-[10px] font-bold text-muted-foreground/40 line-through">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * item.amount)}
                    </span>
                  )}
                </div>
             </div>
          </div>
        </CardContent>
        <div className={cn(
          "absolute left-0 top-0 w-1 h-full bg-primary transform transition-transform duration-500",
          isSelected ? "translate-x-0" : "-translate-x-full group-hover:translate-x-0"
        )} />
      </Card>
    </motion.div>
  );
}

// --- Main Page ---

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, selectedItems, toggleSelectItem, toggleSelectAll } = useCartStore();
  const { user } = useAuthStore();
  const { data: recommendedData, isLoading: recLoading } = useProducts("", 4);

  const selectedCartItems = useMemo(() => 
    cartItems.filter(item => selectedItems.includes(item.product)), 
    [cartItems, selectedItems]
  );

  const subtotal = useMemo(() => selectedCartItems.reduce((total, item) => total + item.price * item.amount, 0), [selectedCartItems]);
  const totalDiscount = useMemo(() => selectedCartItems.reduce((total, item) => total + (item.price * item.discount / 100) * item.amount, 0), [selectedCartItems]);
  const currentTotal = subtotal - totalDiscount;
  const shippingPrice = currentTotal > 0 && currentTotal < 500000 ? 30000 : 0;

  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  if (cartItems.length === 0) {
    return (
      <main className="container max-w-[1280px] mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-[3rem] bg-muted/30 p-16 mb-8 relative"
        >
          <div className="absolute inset-0 border-2 border-dashed border-black/10 dark:border-white/10 rounded-[3rem] animate-[spin_20s_linear_infinite]" />
          <ShoppingBag className="h-20 w-20 text-muted-foreground/40" />
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Giỏ hàng của bạn đang chờ...</h2>
        <p className="text-muted-foreground max-w-sm mb-12 text-lg font-medium leading-relaxed">Đừng để những siêu phẩm công nghệ rời xa bạn. Hãy lấp đầy giỏ hàng và tận hưởng ưu đãi.</p>
        <Button asChild size="lg" className="h-14 px-12 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 active:scale-95 transition-all">
          <Link to="/products">Khám phá sản phẩm ngay</Link>
        </Button>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] pb-24 lg:pb-12">
      <div className="container max-w-[1280px] mx-auto px-6 py-8 md:py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-1">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-2">
                <ShoppingBag className="h-3 w-3" /> Túi mua sắm
             </div>
             <h1 className="text-3xl md:text-4xl font-black tracking-tight">Giỏ hàng của bạn</h1>
             <p className="text-sm text-muted-foreground font-medium">Bạn có {cartItems.length} sản phẩm trong túi.</p>
          </div>
          <Link to="/products" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group">
             Tiếp tục mua sắm <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Items List - 8 cols */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 rounded-2xl ring-1 ring-black/5 shadow-sm">
               <div className="flex items-center gap-3">
                  <Checkbox 
                     checked={isAllSelected} 
                     onCheckedChange={(checked) => toggleSelectAll(checked)}
                     className="h-5 w-5 rounded-md border-black/10 dark:border-white/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-xs font-black uppercase tracking-widest">Chọn tất cả ({cartItems.length})</span>
               </div>
               <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors">Xóa đã chọn</Button>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <CartItemCard 
                    key={item.product} 
                    item={item} 
                    updateQuantity={updateQuantity} 
                    removeFromCart={removeFromCart}
                    userId={user?._id}
                    isSelected={selectedItems.includes(item.product)}
                    onToggleSelect={toggleSelectItem}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Benefits Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
               {[
                 { icon: ShieldCheck, title: "Bảo mật", desc: "Thanh toán an toàn 100%" },
                 { icon: RotateCcw, title: "Đổi trả", desc: "7 ngày dùng thử miễn phí" },
                 { icon: CreditCard, title: "Trả góp", desc: "0% lãi suất qua thẻ" }
               ].map((b, i) => (
                 <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border ring-1 ring-black/5 shadow-sm">
                    <b.icon className="h-5 w-5 text-primary opacity-60" />
                    <div>
                       <h4 className="text-[10px] font-black uppercase tracking-widest">{b.title}</h4>
                       <p className="text-[11px] text-muted-foreground font-medium">{b.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Summary Sidebar - 4 cols */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <Card className="bg-white dark:bg-neutral-900 border-none ring-1 ring-black/5 dark:ring-white/10 shadow-2xl rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3 italic">
                  Tóm tắt đơn hàng <div className="h-1 w-8 bg-primary rounded-full" />
                </h3>

                <FreeShippingProgress total={currentTotal} />

                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                    <span className="text-foreground font-bold">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>Ưu đãi sản phẩm</span>
                    <span className="text-destructive font-bold">-{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalDiscount)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>Vận chuyển</span>
                    <span className="text-foreground font-bold">
                       {shippingPrice === 0 ? "Miễn phí" : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(shippingPrice)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="flex flex-col gap-2.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mã ưu đãi</label>
                      <div className="flex gap-2">
                         <div className="relative flex-1">
                            <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="NHAP-MA-GIAM-GIA" className="h-11 pl-9 rounded-xl text-xs font-bold bg-muted/30 border-none outline-none focus-visible:ring-1 focus-visible:ring-primary/20" />
                         </div>
                         <Button variant="outline" className="h-11 rounded-xl border-2 font-black text-[10px] uppercase px-6">Áp dụng</Button>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-black/5 dark:border-white/5">
                  <div className="flex justify-between items-end mb-8">
                    <div className="space-y-0.5">
                       <span className="text-sm font-black uppercase tracking-widest">Tổng thanh toán</span>
                       <p className="text-[9px] text-muted-foreground font-bold italic opacity-60">*Đã bao gồm VAT 8%</p>
                    </div>
                    <span className="text-3xl font-black text-primary tracking-tighter">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(currentTotal + shippingPrice)}
                    </span>
                  </div>

                  <Button 
                     className="w-full h-16 text-base font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all group" 
                     asChild disabled={selectedItems.length === 0}
                  >
                    <Link to={selectedItems.length > 0 ? "/checkout" : "#"}>
                       Tiến hành thanh toán
                       <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  {selectedItems.length === 0 && <p className="text-[10px] text-center mt-3 text-destructive font-bold uppercase tracking-widest">Vui lòng chọn sản phẩm để mua</p>}
                </div>
              </CardContent>
            </Card>

            {/* Support Box */}
            <div className="p-6 rounded-[1.5rem] border border-dashed border-black/10 dark:border-white/10 flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
               <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Info className="h-5 w-5" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Hỗ trợ trực tuyến 24/7</span>
                  <span className="text-xs font-medium">Tư vấn viên luôn sẵn sàng giải đáp</span>
               </div>
            </div>
          </div>
        </div>

        {/* Recommended - You may also like */}
        <section className="mt-32 space-y-10">
          <div className="flex items-end justify-between border-b border-black/5 pb-6">
             <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">Có thể bạn quan tâm</h2>
                <p className="text-[13px] text-muted-foreground font-medium">Bổ sung vào túi đồ công nghệ những siêu phẩm được ưa chuộng.</p>
             </div>
             <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-transparent hover:text-primary px-0 group" asChild>
                <Link to="/products">Khám phá thêm <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></Link>
             </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recLoading ? (
               Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl" />
               ))
            ) : (
               recommendedData?.data?.map((p) => (
                 <ProductCard key={p._id} product={p} />
               ))
            )}
          </div>
        </section>
      </div>

      {/* Floating Mobile Sticky Bar */}
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100 }} animate={{ y: 0 }}
          className="fixed bottom-6 left-6 right-6 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-3xl ring-1 ring-black/5 dark:ring-white/10 p-3 rounded-[2rem] flex items-center justify-between gap-4 md:hidden shadow-3xl"
        >
          <div className="pl-6 flex flex-col">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60 mb-0.5">Tổng cộng ({selectedItems.length})</span>
            <span className="text-2xl font-black text-primary tracking-tighter leading-none">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(currentTotal + shippingPrice)}
            </span>
          </div>
          <Button 
             className="h-14 px-10 font-black rounded-2xl shadow-2xl shadow-primary/30 active:scale-95 text-xs uppercase tracking-widest" 
             asChild disabled={selectedItems.length === 0}
          >
            <Link to={selectedItems.length > 0 ? "/checkout" : "#"}>Thanh toán</Link>
          </Button>
        </motion.div>
      </AnimatePresence>

      <div className="h-24 md:hidden" />
    </div>
  );
};

export default CartPage;
