import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Zap, 
  RotateCcw, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts, useProductTypes } from "@/features/products/hooks/useProducts";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const cubicBezier = [0.32, 0.72, 0, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: cubicBezier } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// --- Sub-components ---

function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f5f5f7] dark:bg-[#0a0a0a]">
      <div className="container max-w-[1320px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 min-h-[420px] lg:h-[520px] py-12 lg:py-0">
          {/* Text Content */}
          <motion.div 
            initial="hidden" animate="visible" variants={staggerContainer}
            className="flex-1 flex flex-col items-start gap-5 lg:gap-7 z-10"
          >
            <motion.div variants={fadeUp}>
              <Badge className="bg-primary/5 text-primary border-primary/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Sparkles className="mr-2 h-3 w-3" /> New Collection 2026
              </Badge>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-balance">
              Nâng Tầm Trải Nghiệm <br />
              <span className="text-primary/60">Công Nghệ Thông Minh.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-base text-muted-foreground leading-relaxed max-w-md font-medium">
              Khám phá hệ sinh thái thiết bị gia dụng và phụ kiện cao cấp, được thiết kế để kiến tạo không gian sống hiện đại và tinh tế.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" className="h-12 px-8 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-transform active:scale-95" asChild>
                <Link to="/products">Mua sắm ngay</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full font-black text-xs uppercase tracking-widest border-2 transition-all active:scale-95" asChild>
                <Link to="/collections">Bộ sưu tập</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Promotional Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: cubicBezier }}
            className="flex-1 relative w-full h-[300px] lg:h-full flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full lg:w-[110%] aspect-[4/3] lg:aspect-auto h-full rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
              <img 
                src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80" 
                alt="Featured Product" 
                className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/5 pointer-events-none" />
            </div>
            
            {/* Floating Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 bottom-12 hidden lg:flex items-center gap-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl ring-1 ring-black/5"
            >
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                 <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Verified Quality</span>
                 <span className="text-xs font-bold">100% Genuine Tech</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCategories({ types }) {
  // Mapping types to static luxury images
  const categoryImages = {
    electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80",
    accessories: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80",
    "smart-home": "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80",
    wearables: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80",
  };

  return (
    <section className="container max-w-[1320px] mx-auto px-6 py-12 lg:py-16">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center text-center gap-3">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Danh Mục Nổi Bật</h2>
          <div className="h-1 w-12 bg-primary rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {types.slice(0, 4).map((type) => (
            <Link 
              key={type} to={`/products?type=${type}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted transition-all"
            >
              <img 
                src={categoryImages[type] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80"} 
                alt={type} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Explore</span>
                   <span className="text-sm font-black text-white capitalize tracking-tight">{type}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                   <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductGrid({ title, subtitle, products, isLoading }) {
  return (
    <section className="container max-w-[1320px] mx-auto px-6 py-12 lg:py-16">
      <div className="flex flex-col gap-8 lg:gap-10">
        <div className="flex items-end justify-between border-b border-black/5 pb-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight italic">{title}</h2>
            <p className="text-[13px] text-muted-foreground font-medium">{subtitle}</p>
          </div>
          <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest gap-2 hover:bg-transparent hover:text-primary px-0 group" asChild>
            <Link to="/products">
              Tất cả sản phẩm <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))
          ) : (
            products.map((p) => <ProductCard key={p._id} product={p} />)
          )}
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section className="container max-w-[1320px] mx-auto px-6 py-12 lg:py-16">
      <div className="relative h-[320px] lg:h-[400px] rounded-[2.5rem] overflow-hidden bg-primary group">
        <img 
          src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-[3s] group-hover:scale-105"
          alt="Promo"
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary/80 to-transparent" />
        
        <div className="relative h-full flex flex-col justify-center items-start px-8 lg:px-16 gap-5 lg:gap-6 max-w-2xl">
           <Badge className="bg-white/10 text-white border-white/20 text-[9px] font-black uppercase tracking-[0.2em] w-fit">Seasonal Offer</Badge>
           <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-none italic">Thế Hệ Mới Của <br /> Sự Thông Minh.</h2>
           <p className="text-white/70 text-sm lg:text-base font-medium leading-relaxed">
              Giảm ngay 20% cho tất cả các thiết bị gia dụng thông minh trong tuần lễ vàng. Đổi mới không gian, tận hưởng cuộc sống.
           </p>
           <Button size="lg" className="h-12 px-8 rounded-full bg-white text-black hover:bg-white/90 font-black text-xs uppercase tracking-widest mt-2">
              Khám phá ưu đãi
           </Button>
        </div>
      </div>
    </section>
  );
}

function WhyShop() {
  return (
    <section className="bg-[#fcfcfc] dark:bg-[#080a08] py-16 lg:py-20">
      <div className="container max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {[
            { icon: Zap, label: "Giao hàng hỏa tốc", val: "Nhận trong 24h" },
            { icon: ShieldCheck, label: "Bảo hành tận tâm", val: "24 tháng chính hãng" },
            { icon: RotateCcw, label: "Đổi trả dễ dàng", val: "7 ngày dùng thử" },
            { icon: Clock, label: "Hỗ trợ 24/7", val: "Tư vấn chuyên nghiệp" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4 group">
              <div className="h-14 w-14 rounded-2xl bg-white dark:bg-neutral-900 shadow-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 ring-1 ring-black/5">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-widest">{item.label}</h3>
                <p className="text-[13px] text-muted-foreground font-medium">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Main Page ---

export default function HomePage() {
  const { data: productsData, isLoading } = useProducts("", 8);
  const { data: typesData } = useProductTypes();

  const products = productsData?.data || [];
  const types = typesData?.data || [];

  return (
    <div className="flex flex-col gap-4 lg:gap-8 pb-12 overflow-hidden">
      <Hero />
      
      <FeaturedCategories types={types} />

      <ProductGrid 
        title="Sản Phẩm Bán Chạy" 
        subtitle="Những thiết bị được cộng đồng công nghệ tin dùng nhất."
        products={products.slice(0, 4)}
        isLoading={isLoading}
      />

      <PromoBanner />

      <ProductGrid 
        title="Hàng Mới Về" 
        subtitle="Vừa lên kệ những siêu phẩm công nghệ thế hệ tiếp theo."
        products={products.slice(4, 8)}
        isLoading={isLoading}
      />

      <WhyShop />

      {/* Newsletter - Compact dedicated section before footer */}
      <section className="container max-w-[1320px] mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto p-12 rounded-[3rem] bg-white dark:bg-neutral-900 ring-1 ring-black/5 shadow-3xl">
           <div className="h-14 w-14 rounded-full bg-primary/5 flex items-center justify-center text-primary">
              <Mail className="h-6 w-6" />
           </div>
           <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Tham gia cộng đồng Smart Store</h2>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Đăng ký để nhận thông tin về sản phẩm mới, các bản cập nhật firmware và ưu đãi độc quyền dành riêng cho thành viên.
              </p>
           </div>
           <div className="flex w-full max-w-md gap-3 pt-4">
              <input 
                 type="email" placeholder="Địa chỉ email của bạn..."
                 className="flex-1 h-12 px-6 rounded-full bg-muted/50 border-none outline-none focus:ring-1 focus:ring-primary/20 text-sm font-medium transition-all"
              />
              <Button className="h-12 px-8 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95">
                 Đăng ký
              </Button>
           </div>
        </div>
      </section>
    </div>
  );
}
