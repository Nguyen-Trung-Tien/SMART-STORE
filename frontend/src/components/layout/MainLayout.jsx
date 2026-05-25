import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

export function MainLayout() {
  const location = useLocation();
  const hideFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      <Toaster />
    </div>
  );
}
