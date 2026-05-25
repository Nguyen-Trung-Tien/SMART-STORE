import { Link } from "react-router-dom";
import { Globe, MessageSquare, Share2, Send, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background pt-16 pb-8 px-6">
      <div className="container max-w-[1320px] mx-auto grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 mb-16">
        {/* Brand & Info */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <ShieldCheck className="h-5 w-5" />
             </div>
             <h3 className="text-xl font-black tracking-tighter">SMART STORE</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            Nâng tầm trải nghiệm công nghệ với hệ sinh thái thiết bị gia dụng và phụ kiện thông minh hàng đầu. Chất lượng đỉnh cao, dịch vụ tận tâm.
          </p>
          <div className="flex items-center gap-4">
            {[Globe, MessageSquare, Share2, Mail].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">Sản phẩm</h4>
          <nav className="flex flex-col gap-3 text-[13px] font-medium text-muted-foreground">
            <Link to="/category/electronics" className="hover:text-primary transition-colors">Điện tử & Công nghệ</Link>
            <Link to="/category/accessories" className="hover:text-primary transition-colors">Phụ kiện cao cấp</Link>
            <Link to="/category/smart-home" className="hover:text-primary transition-colors">Nhà thông minh</Link>
            <Link to="/category/new" className="hover:text-primary transition-colors">Hàng mới về</Link>
          </nav>
        </div>

        {/* Links Column 2 */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">Hỗ trợ</h4>
          <nav className="flex flex-col gap-3 text-[13px] font-medium text-muted-foreground">
            <Link to="/contact" className="hover:text-primary transition-colors">Liên hệ chúng tôi</Link>
            <Link to="/faq" className="hover:text-primary transition-colors">Câu hỏi thường gặp</Link>
            <Link to="/shipping" className="hover:text-primary transition-colors">Chính sách vận chuyển</Link>
            <Link to="/warranty" className="hover:text-primary transition-colors">Chính sách bảo hành</Link>
          </nav>
        </div>

        {/* Newsletter */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">Bản tin công nghệ</h4>
          <p className="text-[13px] text-muted-foreground">Đăng ký để nhận ưu đãi sớm nhất và thông tin về bộ sưu tập mới.</p>
          <div className="relative group">
            <Input 
              type="email" 
              placeholder="Email của bạn..." 
              className="h-11 rounded-xl bg-muted/30 border-none pr-12 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
            />
            <Button size="icon" className="absolute right-1 top-1 h-9 w-9 rounded-lg shadow-lg">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-[1320px] mx-auto border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
          © {new Date().getFullYear()} Smart Store Technology. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
           <Link to="/privacy" className="hover:text-primary transition-colors">Quyền riêng tư</Link>
           <Link to="/terms" className="hover:text-primary transition-colors">Điều khoản</Link>
           <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
