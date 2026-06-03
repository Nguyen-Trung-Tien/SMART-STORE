import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { routePaths } from "@/config/routes";

export function Logo() {
  return (
    <Link to={routePaths.home} className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
        <ShoppingBag className="h-5 w-5" />
      </span>
      <span className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Smart</span>
        <span className="text-lg font-extrabold tracking-tight">Store</span>
      </span>
    </Link>
  );
}
