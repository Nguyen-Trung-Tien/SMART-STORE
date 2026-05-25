import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-12 px-4">
      <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold">SMART STORE</h3>
          <p className="text-sm text-muted-foreground">
            Hệ thống cửa hàng thông minh, cung cấp các sản phẩm công nghệ chất lượng cao với dịch vụ hậu mãi tốt nhất.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider">Sản phẩm</h4>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/category/electronics" className="hover:text-primary transition-colors">Điện tử</Link>
            <Link to="/category/accessories" className="hover:text-primary transition-colors">Phụ kiện</Link>
            <Link to="/category/smart-home" className="hover:text-primary transition-colors">Nhà thông minh</Link>
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider">Hỗ trợ</h4>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/contact" className="hover:text-primary transition-colors">Liên hệ</Link>
            <Link to="/faq" className="hover:text-primary transition-colors">Câu hỏi thường gặp</Link>
            <Link to="/shipping" className="hover:text-primary transition-colors">Chính sách vận chuyển</Link>
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider">Liên kết</h4>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Twitter</a>
          </nav>
        </div>
      </div>
      <div className="container mx-auto mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SMART STORE. Bảo lưu mọi quyền.
      </div>
    </footer>
  );
}
