import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/my-orders");
    }
  }, [countdown, navigate]);

  return (
    <main className="container mx-auto flex h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        </div>
      </div>

      <Badge
        variant="outline"
        className="mt-8 border-emerald-500/30 text-emerald-600 font-bold uppercase tracking-widest px-4 py-1"
      >
        Đã nhận đơn hàng
      </Badge>

      <h1 className="mt-6 text-5xl font-black tracking-tight">Cảm ơn bạn!</h1>
      <p className="mt-4 max-w-[500px] text-lg text-muted-foreground leading-relaxed">
        Đơn hàng của bạn đã được xác nhận thành công. Chúng tôi sẽ sớm đóng gói
        và giao hàng đến tận tay bạn.
      </p>

      <div className="mt-4 text-sm text-muted-foreground">
        Tự động chuyển sang trang đơn hàng trong {countdown} giây...
      </div>
      <div className="mt-12 flex flex-col gap-4 sm:flex-row min-w-[400px]">
        <Button
          asChild
          size="lg"
          className="flex-1 h-14 font-black shadow-lg shadow-primary/20"
        >
          <Link to="/products">
            Tiếp tục mua sắm <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="flex-1 h-14 font-bold"
        >
          <Link to="/my-orders">
            <Package className="mr-2 h-5 w-5" /> Quản lý đơn hàng
          </Link>
        </Button>
      </div>

      <Button asChild variant="ghost" className="mt-8 text-muted-foreground">
        <Link to="/">
          <Home className="mr-2 h-4 w-4" /> Quay về trang chủ
        </Link>
      </Button>
    </main>
  );
}
