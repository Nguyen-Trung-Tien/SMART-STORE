import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ title = "Something went wrong", description, onRetry }) {
  return (
    <div className="surface flex flex-col items-center gap-4 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
    </div>
  );
}
