import { ChevronRight, Calendar, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { statusConfig } from "../constants";
import { OrderDetailsSheet } from "./OrderDetailsSheet";

export function OrderCard({ order }) {
  const status = statusConfig[order.status] || statusConfig.Pending;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.div
          whileHover={{ y: -2, shadow: "0 10px 20px rgba(0,0,0,0.05)" }}
          className="group relative bg-white dark:bg-neutral-900 rounded-xl border ring-1 ring-black/5 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 cursor-pointer transition-all overflow-hidden"
        >
          {/* Product Group */}
          <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
            {/* Thumbnail with Badge in corner */}
            <div className="relative flex-shrink-0">
              <div className="h-14 w-14 rounded-lg bg-muted overflow-hidden border">
                <img
                  src={order.orderItems[0].image}
                  alt="thumb"
                  className="h-full w-full object-contain p-1"
                />
              </div>
              {order.orderItems.length > 1 && (
                <div className="absolute -right-1.5 -bottom-1.5 h-5 w-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-2 border-white dark:border-neutral-900 flex items-center justify-center text-[8px] font-black shadow-md z-10">
                  +{order.orderItems.length - 1}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 flex-shrink-0">
                  #{order._id.slice(-8).toUpperCase()}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md px-1.5 py-0 h-4 text-[8px] font-black uppercase tracking-widest border-none shrink-0",
                    status.color,
                  )}
                >
                  {status.label}
                </Badge>
              </div>
              <h3 className="font-bold text-xs md:text-sm truncate leading-tight group-hover:text-primary transition-colors">
                {order.orderItems.map((item) => item.name).join(", ")}
              </h3>
              <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" />{" "}
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="h-2.5 w-2.5" /> {order.orderItems.length}{" "}
                  SP
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Icon Group */}
          <div className="flex items-center justify-between sm:justify-end sm:gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
            <div className="flex flex-col sm:items-end flex-shrink-0 min-w-[100px]">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
                Tổng thanh toán
              </span>
              <span className="text-base font-black tracking-tight text-primary leading-none mt-0.5 whitespace-nowrap">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.totalPrice)}
              </span>
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted/30 group-hover:bg-primary group-hover:text-white transition-all opacity-40 group-hover:opacity-100 flex-shrink-0">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          <div className="absolute left-0 top-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </SheetTrigger>
      <OrderDetailsSheet order={order} />
    </Sheet>
  );
}
