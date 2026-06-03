import { Navigate, Outlet } from "react-router-dom";
import { routePaths } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";

export function GuestRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to={routePaths.home} replace /> : <Outlet />;
}
