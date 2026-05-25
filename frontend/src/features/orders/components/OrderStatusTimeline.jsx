import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusConfig } from "../constants";

export function OrderStatusTimeline({ currentStatus }) {
  const steps = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentIdx = steps.indexOf(currentStatus);

  if (currentStatus === "Cancelled") {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/5 text-rose-600 border border-rose-500/10">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Đơn hàng này đã bị hủy
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-between w-full py-2 px-1">
      {steps.map((step, idx) => {
        const Icon = statusConfig[step].icon;
        const isActive = idx <= currentIdx;
        const isLast = idx === steps.length - 1;

        return (
          <div
            key={step}
            className="relative flex flex-col items-center flex-1"
          >
            <div
              className={cn(
                "z-10 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-500",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span
              className={cn(
                "absolute -bottom-5 text-[8px] font-black uppercase tracking-tighter whitespace-nowrap",
                isActive ? "text-primary" : "text-muted-foreground opacity-40",
              )}
            >
              {statusConfig[step].label}
            </span>
            {!isLast && (
              <div className="absolute left-[50%] top-3.5 w-full h-[1.5px] bg-muted -translate-y-1/2">
                <div
                  className={cn(
                    "h-full bg-primary transition-all duration-700",
                    idx < currentIdx ? "w-full" : "w-0",
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
