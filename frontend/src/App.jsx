import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { router } from "@/router";
import { AppProvider } from "@/app/provider";
import { ErrorFallback } from "@/components/feedback/ErrorFallback";
import { authApi } from "@/api/auth.api";
import { authService } from "@/services/auth.service";
import { markHydrated, setCredentials, logout } from "@/store/slices/authSlice";

function AppBootstrap({ error, reset }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const refreshed = await authService.refresh();
        if (!mounted || !refreshed?.access_token) {
          dispatch(markHydrated());
          return;
        }

        const sessionUser = authService.getSessionUser(refreshed.access_token);
        let profile = sessionUser;

        if (sessionUser?.id) {
          try {
            const profileResponse = await authApi.getProfile(sessionUser.id);
            profile = profileResponse?.data || sessionUser;
          } catch {
            profile = sessionUser;
          }
        }

        dispatch(
          setCredentials({
            accessToken: refreshed.access_token,
            user: profile,
          })
        );
      } catch {
        dispatch(logout());
      } finally {
        if (mounted) {
          dispatch(markHydrated());
        }
      }
    };

    hydrate();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  if (error) {
    return <ErrorFallback error={error} resetErrorBoundary={reset} />;
  }

  return <RouterProvider router={router} />;
}

export default function App(props) {
  return (
    <AppProvider>
      <AppBootstrap {...props} />
    </AppProvider>
  );
}
