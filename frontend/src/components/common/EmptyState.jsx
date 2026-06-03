import { Button } from "@/components/ui/button";

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="surface flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
      <div className="max-w-md space-y-2">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
