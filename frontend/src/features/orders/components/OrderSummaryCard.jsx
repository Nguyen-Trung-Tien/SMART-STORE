import { cn } from "@/lib/utils";

export function OrderSummaryCard({ icon: Icon, label, count, color }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-neutral-900 border ring-1 ring-black/5 shadow-sm">
      <div
        className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0",
          color,
        )}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground truncate">
          {label}
        </span>
        <span className="text-base font-black tracking-tight">{count}</span>
      </div>
    </div>
  );
}
