import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { router } from "@/router";
import { AppProvider } from "@/app/provider";
import { ErrorFallback } from "@/components/feedback/ErrorFallback";
import { authApi } from "@/api/auth.api";
import { authService } from "@/services/auth.service";
import { markHydrated, setCredentials, logout } from "@/store/slices/authSlice";
import { FloatingChatWidget } from "@/components/chat/FloatingChatWidget";

function AppBootstrap({ error, reset }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const refreshed = await authService.refresh();
        const accessToken = refreshed?.access_token || refreshed?.data?.access_token;

        if (!mounted || !accessToken) {
          dispatch(markHydrated());
          return;
        }

        const sessionUser = authService.getSessionUser(accessToken);
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
            accessToken,
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

  return (
    <>
      <RouterProvider router={router} />
      <FloatingChatWidget />
    </>
  );
}

export default function App(props) {
  return (
    <AppProvider>
      <AppBootstrap {...props} />
    </AppProvider>
  );
}
