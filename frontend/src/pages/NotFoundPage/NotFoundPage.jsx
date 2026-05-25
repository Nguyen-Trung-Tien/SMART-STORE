import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ghost, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="container mx-auto flex h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10" />
        <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-muted">
          <Ghost className="h-20 w-20 text-muted-foreground" />
        </div>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-4xl font-black text-primary-foreground shadow-xl">
          404
        </span>
      </div>
      
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Ối! Trang không tìm thấy</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Có vẻ như trang bạn đang tìm kiếm đã bị di dời hoặc không còn tồn tại nữa. Đừng lo lắng, hãy để chúng tôi đưa bạn về nhà.
      </p>
      
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="lg" asChild className="h-12 px-8 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" /> Về trang chủ
          </Link>
        </Button>
        <Button variant="outline" size="lg" onClick={() => window.history.back()} className="h-12 px-8 font-bold">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
      </div>
    </div>
  );
}
