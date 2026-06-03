import { Navigate, Outlet } from "react-router-dom";
import { routePaths } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";

export function AdminRoute() {
  const { isHydrated, isAuthenticated, isAdmin } = useAuth();

  if (!isHydrated) {
    return <LoadingScreen message="Checking permissions..." />;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to={routePaths.home} replace />;
  }

  return <Outlet />;
}
