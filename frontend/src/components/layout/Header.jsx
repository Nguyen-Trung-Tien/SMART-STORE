import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  Heart,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "../mode-toggle";
import { useEffect } from "react";

export function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { cartItems, fetchCart, syncCart } = useCartStore();

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      syncCart(user._id);
      fetchCart(user._id);
    }
  }, [isAuthenticated, user?._id, fetchCart, syncCart]);

  const totalItems = cartItems.reduce((total, item) => total + item.amount, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 h-[72px] flex items-center">
      <div className="container max-w-[1320px] mx-auto flex items-center justify-between px-6">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-4 lg:gap-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <div className="flex flex-col gap-6 mt-10">
                <span className="text-lg font-black tracking-tighter text-primary px-2">
                  SMART STORE
                </span>
                <nav className="flex flex-col gap-2">
                  <Link
                    to="/"
                    className="px-2 py-3 text-sm font-bold hover:bg-muted rounded-xl transition-colors"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    to="/products"
                    className="px-2 py-3 text-sm font-bold hover:bg-muted rounded-xl transition-colors"
                  >
                    Sản phẩm
                  </Link>
                  <Link
                    to="/collections"
                    className="px-2 py-3 text-sm font-bold hover:bg-muted rounded-xl transition-colors"
                  >
                    Bộ sưu tập
                  </Link>
                  {isAuthenticated &&
                    (user?.isAdmin ||
                      user?.role?.toLowerCase() === "admin") && (
                      <Link
                        to="/admin"
                        className="px-2 py-3 text-sm font-bold hover:bg-muted rounded-xl transition-colors text-primary"
                      >
                        Quản trị
                      </Link>
                    )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-black tracking-tighter text-primary group-hover:opacity-80 transition-opacity">
              SMART STORE
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-bold uppercase tracking-wider text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <Link
              to="/products"
              className="hover:text-primary transition-colors"
            >
              Sản phẩm
            </Link>
            {isAuthenticated &&
              (user?.isAdmin || user?.role?.toLowerCase() === "admin") && (
                <Link
                  to="/admin"
                  className="hover:text-primary transition-colors text-primary"
                >
                  Quản trị
                </Link>
              )}
          </nav>
        </div>

        {/* Search Bar - Centered */}
        <div className="hidden md:flex flex-1 items-center justify-center max-w-[480px] mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm đỉnh cao..."
              className="pl-10 h-10 w-full bg-muted/40 border-none rounded-full focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:bg-muted transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 lg:gap-3">
          <Button variant="ghost" size="icon" className="md:hidden h-10 w-10">
            <Search className="h-5 w-5" />
          </Button>

          <div className="hidden lg:flex items-center">
            <ModeToggle />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hidden sm:flex"
          >
            <Heart className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-10 w-10 relative"
          >
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-black text-primary-foreground shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>

          <div className="h-5 w-px bg-border mx-1 hidden sm:block" />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 gap-2 px-2 hover:bg-muted/50 rounded-full"
                >
                  <Avatar className="h-7 w-7 border ring-1 ring-black/5">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="font-black text-[10px]">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block text-xs font-bold">
                    {user?.name?.split(" ").pop()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-2xl p-2 mt-2 shadow-2xl border-black/5"
                align="end"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-black leading-none tracking-tight">
                        {user?.name}
                      </p>
                      <p className="text-[10px] leading-none text-muted-foreground font-medium">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="p-1">
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl p-2.5 cursor-pointer"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-xs font-bold"
                    >
                      <User className="h-4 w-4" /> Hồ sơ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-xl p-2.5 cursor-pointer"
                  >
                    <Link
                      to="/my-orders"
                      className="flex items-center gap-2 text-xs font-bold"
                    >
                      <Check className="h-4 w-4" /> Đơn hàng
                    </Link>
                  </DropdownMenuItem>
                  {(user?.isAdmin || user?.role?.toLowerCase() === "admin") && (
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl p-2.5 cursor-pointer text-primary"
                    >
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 text-xs font-bold"
                      >
                        <ShieldCheck className="h-4 w-4" /> Quản trị
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="p-1">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-xl p-2.5 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5 font-bold text-xs"
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant="default"
              size="sm"
              className="h-9 px-5 rounded-full font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/20"
            >
              <Link to="/login">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
