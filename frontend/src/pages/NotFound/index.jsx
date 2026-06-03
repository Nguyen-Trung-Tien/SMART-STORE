import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="py-16">
      <EmptyState
        title="Page not found"
        description="The route you requested does not exist in this application."
        actionLabel="Go home"
        onAction={() => navigate("/")}
      />
    </div>
  );
}
