import { Moon, ShoppingCart, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { routePaths } from "@/config/routes";
import { authService } from "@/services/auth.service";
import { logout } from "@/store/slices/authSlice";

const navItems = [
  { to: routePaths.products, label: "Products" },
  { to: routePaths.cart, label: "Cart" },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container flex h-20 items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="text-sm font-semibold text-muted-foreground transition hover:text-foreground">
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link to={routePaths.cart}>
              <ShoppingCart className="h-4 w-4" />
              {cartCount ? (
                <motion.span
                  layout
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
                >
                  {cartCount}
                </motion.span>
              ) : null}
            </Link>
          </Button>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  {user?.name || "Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={routePaths.profile}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={routePaths.orders}>Orders</Link>
                </DropdownMenuItem>
                {user?.isAdmin ? (
                  <DropdownMenuItem asChild>
                    <Link to={routePaths.adminDashboard}>Admin</Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to={routePaths.login}>Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
