import { Navigate, Outlet, useLocation } from "react-router-dom";
import { routePaths } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";

export function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) {
    return <LoadingScreen message="Restoring your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={routePaths.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
