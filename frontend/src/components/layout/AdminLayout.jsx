import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBasket, Users, TicketPercent, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Sản phẩm", href: "/admin/products", icon: ShoppingBasket },
  { name: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Vouchers", href: "/admin/vouchers", icon: TicketPercent },
  { name: "Hỗ trợ", href: "/admin/support", icon: MessageSquare },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="text-xl font-bold text-primary">SMART ADMIN</Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-background px-8">
          <h1 className="text-lg font-semibold">Bảng điều khiển</h1>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
