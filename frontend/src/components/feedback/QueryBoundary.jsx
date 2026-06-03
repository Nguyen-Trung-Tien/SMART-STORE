import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";

export function QueryBoundary({ query, isEmpty, emptyProps, children }) {
  if (query.isLoading) {
    return <LoadingScreen />;
  }

  if (query.isError) {
    return <ErrorState description={query.error?.message} onRetry={query.refetch} />;
  }

  if (isEmpty) {
    return <EmptyState {...emptyProps} />;
  }

  return children;
}
