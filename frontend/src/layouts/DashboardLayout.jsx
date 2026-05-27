import { LayoutDashboard, Package, Receipt, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: Receipt },
  { to: "/admin/users", label: "Users", icon: Users },
];

export function DashboardLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[280px,1fr]">
      <aside className="border-r bg-slate-950 px-6 py-8 text-white">
        <Logo />
        <nav className="mt-10 space-y-2">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white", isActive && "bg-white/10 text-white")
                }
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <div className="p-6 md:p-8">
        <Outlet />
      </div>
    </div>
  );
}
