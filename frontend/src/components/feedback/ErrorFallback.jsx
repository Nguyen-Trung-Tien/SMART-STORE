import { ErrorState } from "@/components/common/ErrorState";

export function ErrorFallback({ error, resetErrorBoundary }) {
  const resolvedError = error;

  return (
    <div className="container py-16">
      <ErrorState
        title="Application error"
        description={resolvedError?.message || "An unexpected error occurred."}
        onRetry={() => {
          if (resetErrorBoundary) {
            resetErrorBoundary();
            return;
          }

          window.location.reload();
        }}
      />
    </div>
  );
}
