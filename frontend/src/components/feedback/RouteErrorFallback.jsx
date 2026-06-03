import { useRouteError } from "react-router-dom";
import { ErrorFallback } from "@/components/feedback/ErrorFallback";

export function RouteErrorFallback() {
  const error = useRouteError();
  return <ErrorFallback error={error} />;
}
