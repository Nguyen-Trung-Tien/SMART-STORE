import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  ShoppingCart,
  Users,
  MessageSquare,
  Tag,
  Boxes,
  CreditCard,
  Bell,
  FileText,
  Settings,
  ShieldAlert,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";

const sidebarGroups = [
  {
    title: "Overview",
    links: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Catalog",
    links: [
      { name: "Products", href: "/admin/products", icon: ShoppingBag },
      { name: "Categories", href: "/admin/categories", icon: FolderTree },
      { name: "Inventory", href: "/admin/inventory", icon: Boxes },
    ],
  },
  {
    title: "Sales",
    links: [
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { name: "Payments", href: "/admin/payments", icon: CreditCard },
      { name: "Promotions", href: "/admin/promotions", icon: Tag },
    ],
  },
  {
    title: "Customers",
    links: [
      { name: "Customers", href: "/admin/customers", icon: Users },
      { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    ],
  },
  {
    title: "System",
    links: [
      { name: "Content", href: "/admin/content", icon: FileText },
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
      { name: "Roles & Admins", href: "/admin/roles", icon: ShieldAlert },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div
        className={cn(
          "flex h-16 items-center border-b border-border px-4",
          collapsed && !isMobile ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed || isMobile ? (
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">
              S
            </div>
            <span className="text-lg font-bold tracking-tight">SmartStore</span>
          </Link>
        ) : (
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">
            S
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex text-muted-foreground hover:text-foreground"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {sidebarGroups.map((group, index) => (
          <div key={index} className="mb-6 px-3">
            {(!collapsed || isMobile) && (
              <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h4>
            )}
            <nav className="flex flex-col gap-1">
              {group.links.map((link) => {
                const Icon = link.icon;
                const isActive =
                  location.pathname === link.href ||
                  (location.pathname.startsWith(link.href) &&
                    link.href !== "/admin");

                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => isMobile && setSheetOpen(false)}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && !isMobile ? "justify-center px-0" : "gap-3",
                    )}
                    title={collapsed && !isMobile ? link.name : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {(!collapsed || isMobile) && <span>{link.name}</span>}

                    {/* Tooltip for collapsed state */}
                    {collapsed && !isMobile && (
                      <div className="absolute left-full ml-2 hidden rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md group-hover:block z-50 whitespace-nowrap border border-border">
                        {link.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        {!collapsed || isMobile ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-sm font-medium truncate">
                {user?.name || "Admin User"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.role || "Super Admin"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer border border-border hover:opacity-80 transition-opacity">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || "Admin User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:bg-destructive/10 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:block transition-all duration-300 ease-in-out sticky top-0 h-screen z-40",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 md:px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 sm:w-72">
                <SidebarContent isMobile={true} />
              </SheetContent>
            </Sheet>

            <div className="hidden sm:flex relative w-64 lg:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, orders, customers..."
                className="w-full bg-muted/50 pl-9 border-border focus-visible:ring-primary h-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden sm:flex h-9 border-border"
            >
              <Link to="/">View Store</Link>
            </Button>

            {/* Mobile Auth Dropdown (since sidebar doesn't show it easily) */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {user?.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      {user?.name || "Admin User"}
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
