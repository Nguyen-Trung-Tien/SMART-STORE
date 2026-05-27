import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { routePaths } from "@/config/routes";
import { authService } from "@/services/auth.service";
import { logout } from "@/store/slices/authSlice";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/#categories" },
  { label: "New Arrivals", href: "/#new-arrivals" },
  { label: "Deals", href: "/#deals" },
  { label: "About", href: "/#about" },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentPath = location.pathname;
  const isDark = theme === "dark";

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logout());
  };

  const navContent = useMemo(
    () =>
      navItems.map((item) => {
        const isHomeAnchor = item.href.startsWith("/#");
        const isActive = isHomeAnchor ? currentPath === routePaths.home : currentPath === item.href;

        return (
          <a
            key={item.label}
            href={item.href}
            className={`text-sm font-semibold transition ${
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </a>
        );
      }),
    [currentPath]
  );

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-4">
      <motion.div
        animate={{
          y: scrolled ? 0 : 2,
          boxShadow: scrolled ? "0 18px 40px -28px rgba(15, 23, 42, 0.35)" : "0 0 0 rgba(0, 0, 0, 0)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`mx-auto max-w-[88rem] rounded-[1.75rem] border px-4 md:px-5 ${
          scrolled
            ? "border-border/70 bg-background/75 backdrop-blur-xl"
            : "border-border/40 bg-background/55 backdrop-blur-md"
        }`}
      >
        <div className="flex h-18 items-center gap-4 lg:h-20">
          <div className="shrink-0">
            <Logo />
          </div>

          <nav className="hidden items-center gap-6 lg:flex">{navContent}</nav>

          <div className="hidden flex-1 items-center justify-center xl:flex">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search products"
                placeholder="Search products, brands, and categories"
                className="h-11 rounded-full border-white/50 bg-white/70 pl-11 backdrop-blur dark:border-white/10 dark:bg-white/5"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setTheme(isDark ? "light" : "dark")}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button variant="ghost" size="icon" className="hidden rounded-full sm:inline-flex">
              <Heart className="h-4 w-4" />
            </Button>

            <Button asChild variant="ghost" size="icon" className="relative rounded-full">
              <Link to={routePaths.cart}>
                <ShoppingCart className="h-4 w-4" />
                <AnimatePresence>
                  {cartCount ? (
                    <motion.span
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                    >
                      {cartCount}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </Link>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden rounded-full border-white/50 bg-white/70 px-4 backdrop-blur sm:inline-flex dark:border-white/10 dark:bg-white/5">
                    <User className="h-4 w-4" />
                    {user?.name || "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-2xl">
                  <DropdownMenuItem asChild>
                    <NavLink to={routePaths.profile}>Profile</NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to={routePaths.orders}>Orders</NavLink>
                  </DropdownMenuItem>
                  {user?.isAdmin ? (
                    <DropdownMenuItem asChild>
                      <NavLink to={routePaths.adminDashboard}>Admin</NavLink>
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="hidden rounded-full px-5 sm:inline-flex">
                <Link to={routePaths.login}>Sign in</Link>
              </Button>
            )}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="rounded-l-[2rem] border-border/60 bg-background/95 px-6 py-14 backdrop-blur-xl">
                <div className="space-y-8">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      aria-label="Search products"
                      placeholder="Search the store"
                      className="h-11 rounded-full pl-11"
                    />
                  </div>

                  <nav className="flex flex-col gap-4">{navContent}</nav>

                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="flex-1 rounded-full">
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </Button>
                    {!isAuthenticated ? (
                      <Button asChild className="flex-1 rounded-full">
                        <Link to={routePaths.login} onClick={() => setMobileOpen(false)}>
                          Sign in
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
