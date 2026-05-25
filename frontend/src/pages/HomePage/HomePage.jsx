import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Timer, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import CountdownTimer from "@/components/CountdownTimer";
import { useProducts, useProductTypes } from "@/features/products/hooks/useProducts";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const flashSaleEndDate = new Date();
  flashSaleEndDate.setDate(flashSaleEndDate.getDate() + 2);

  const { data: productsData, isLoading } = useProducts("", 8);
  const { data: typesData } = useProductTypes();

  const products = productsData?.data || [];
  const types = typesData?.data || [];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col items-center gap-6 text-center">
            <Badge variant="outline" className="border-accent text-accent animate-bounce">
              <Sparkles className="mr-2 h-3 w-3" /> Bộ sưu tập Mùa hè 2026
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              Nâng tầm <span className="text-accent">Phong cách Sống</span>
            </h1>
            <p className="max-w-[700px] text-lg text-primary-foreground/80 sm:text-xl">
              Khám phá hệ sinh thái thiết bị gia dụng thông minh và phụ kiện công nghệ đỉnh cao, kiến tạo không gian sống hiện đại.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild className="h-12 px-8">
                <Link to="/products">Mua sắm ngay <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 bg-transparent text-white border-white/20 hover:bg-white/10">
                <Link to="/about">Tìm hiểu thêm</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col gap-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold">Danh mục Nổi bật</h2>
              <p className="text-muted-foreground mt-2">Dễ dàng tìm kiếm sản phẩm theo nhu cầu của bạn</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {types.map((type) => (
              <Link 
                key={type} 
                to={`/products?type=${type}`}
                className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Zap className="h-6 w-6" />
                </div>
                <span className="font-semibold capitalize">{type}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-accent/20 to-primary/10 py-16 px-8 text-center border">
          <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          
          <div className="relative flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-sm">
                <Timer className="h-5 w-5" />
                <span>Ưu đãi giới hạn</span>
              </div>
              <h2 className="text-4xl font-black md:text-5xl">Flash Sale Cuối Tuần</h2>
              <p className="text-muted-foreground text-lg max-w-md">Đừng bỏ lỡ cơ hội sở hữu công nghệ đỉnh cao với mức giá không tưởng.</p>
            </div>
            
            <CountdownTimer targetDate={flashSaleEndDate} />

            <Button size="lg" asChild className="h-12 px-10 shadow-lg shadow-primary/20">
              <Link to="/products?filter=discount">Săn deal ngay</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold italic tracking-tight">Sản phẩm <span className="text-primary underline decoration-accent decoration-4 underline-offset-8">Bán chạy</span></h2>
              <p className="text-muted-foreground mt-3">Những thiết bị được cộng đồng yêu thích nhất</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/products" className="group">
                Xem tất cả <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))
            ) : (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center gap-5 text-center group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Zap className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Giao hàng cực nhanh</h3>
                <p className="text-muted-foreground">Nhận hàng trong vòng 24h đối với khu vực nội thành, miễn phí cho đơn từ 2tr.</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-5 text-center group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Bảo hành chính hãng</h3>
                <p className="text-muted-foreground">Cam kết sản phẩm 100% chính hãng, hỗ trợ bảo hành tận nơi lên tới 24 tháng.</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-5 text-center group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Đổi trả dễ dàng</h3>
                <p className="text-muted-foreground">Hỗ trợ đổi trả miễn phí trong vòng 7 ngày đầu nếu phát sinh lỗi nhà sản xuất.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4">
        <div className="rounded-3xl bg-primary py-16 px-8 text-primary-foreground md:px-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold md:text-4xl">Đăng ký nhận bản tin công nghệ</h2>
              <p className="text-primary-foreground/70 text-lg">Nhận thông báo về sản phẩm mới và các ưu đãi độc quyền dành riêng cho bạn.</p>
            </div>
            <div className="flex gap-2 max-w-md">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:ring-2 focus:ring-accent outline-none"
              />
              <Button variant="accent" className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 font-bold">Tham gia</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
