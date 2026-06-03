import { cn } from "@/lib/utils";

export function FormField({ label, error, description, className, children }) {
  return (
    <div className={cn("space-y-2", className)}>
      {label ? <label className="text-sm font-semibold text-foreground">{label}</label> : null}
      {children}
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
