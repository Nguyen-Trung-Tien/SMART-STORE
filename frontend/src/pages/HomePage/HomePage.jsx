import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              Trải nghiệm Công nghệ <span className="text-accent">Thông minh</span>
            </h1>
            <p className="max-w-[600px] text-lg text-primary-foreground/80">
              Khám phá bộ sưu tập thiết bị gia dụng và phụ kiện công nghệ hàng đầu, nâng tầm cuộc sống của bạn.
            </p>
            <div className="flex gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/products">Mua ngay <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Giao hàng cực nhanh</h3>
            <p className="text-sm text-muted-foreground">Nhận hàng trong vòng 24h đối với khu vực nội thành.</p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Bảo hành chính hãng</h3>
            <p className="text-sm text-muted-foreground">Cam kết sản phẩm 100% chính hãng, bảo hành lên tới 24 tháng.</p>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Đổi trả dễ dàng</h3>
            <p className="text-sm text-muted-foreground">Hỗ trợ đổi trả miễn phí trong vòng 7 ngày nếu có lỗi.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
