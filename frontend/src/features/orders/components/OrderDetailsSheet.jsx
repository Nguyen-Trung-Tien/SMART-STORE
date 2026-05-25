import { MapPin, CreditCard, Download, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { orderService } from "@/features/orders/services/orderService";
import { statusConfig } from "../constants";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { OrderItem } from "./OrderItem";

export function OrderDetailsSheet({ order }) {
  const handleDownloadInvoice = async () => {
    try {
      const response = await orderService.downloadInvoice(order._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `invoice-${order._id.slice(-6).toUpperCase()}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      toast.success("Đã tải hóa đơn thành công");
    } catch (error) {
      toast.error("Không thể tải hóa đơn");
    }
  };

  return (
    <SheetContent className="w-full sm:max-w-[420px] border-none bg-[#FAFAFA] dark:bg-[#0A0A0A] p-0 overflow-hidden shadow-2xl">
      <div className="h-full flex flex-col">
        <SheetHeader className="p-5 bg-white dark:bg-neutral-900 border-b relative shrink-0">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-md text-[8px] font-black uppercase tracking-widest",
                  statusConfig[order.status]?.color,
                )}
              >
                {statusConfig[order.status]?.label}
              </Badge>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                #{order._id.slice(-8).toUpperCase()}
              </span>
            </div>
            <SheetTitle className="text-lg font-black tracking-tight">
              Chi tiết đơn hàng
            </SheetTitle>
            <SheetDescription className="text-[9px] font-bold uppercase tracking-widest opacity-50">
              Ngày: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-5 space-y-5 no-scrollbar scrollbar-hide">
          {/* Tracking */}
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border ring-1 ring-black/5 shadow-sm space-y-5 pb-7">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Tiến độ vận chuyển
            </h3>
            <OrderStatusTimeline currentStatus={order.status} />
          </div>

          {/* Info grid */}
          <div className="grid gap-3 grid-cols-1">
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border ring-1 ring-black/5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <MapPin className="h-3.5 w-3.5" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">
                  Giao hàng
                </h3>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold truncate">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  {order.shippingAddress.address}, {order.shippingAddress.city}
                </p>
                <p className="text-[10px] font-bold pt-1 opacity-70">
                  {order.shippingAddress.phone}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border ring-1 ring-black/5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <CreditCard className="h-3.5 w-3.5" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">
                  Thanh toán
                </h3>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase">
                  {order.paymentMethod}
                </span>
                <Badge
                  variant={order.isPaid ? "default" : "outline"}
                  className={cn(
                    "rounded-md text-[8px] font-black uppercase tracking-widest h-5",
                    order.isPaid
                      ? "bg-emerald-500/10 text-emerald-600 border-none"
                      : "text-amber-500 border-amber-500/20",
                  )}
                >
                  {order.isPaid ? "Đã trả" : "Chờ trả"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border ring-1 ring-black/5 shadow-sm space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Sản phẩm
            </h3>
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {order.orderItems.map((item, idx) => (
                <OrderItem key={idx} item={item} />
              ))}
            </div>
          </div>

          {/* Billing */}
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border ring-1 ring-black/5 shadow-sm space-y-2.5">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
              <span>Tạm tính</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.itemsPrice)}
              </span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
              <span>Vận chuyển</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.shippingPrice)}
              </span>
            </div>
            <div className="h-px bg-black/5 dark:bg-white/5" />
            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] font-black uppercase tracking-widest">
                Tổng cộng
              </span>
              <span className="text-base font-black text-primary tracking-tighter">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-neutral-900 border-t flex gap-3 mt-auto shrink-0">
          <Button
            variant="outline"
            className="flex-1 h-10 rounded-lg font-black text-[9px] uppercase tracking-widest border-2"
            onClick={handleDownloadInvoice}
          >
            <Download className="h-3.5 w-3.5 mr-2" /> Hóa đơn
          </Button>
          <Button className="flex-1 h-10 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/10">
            <RefreshCcw className="h-3.5 w-3.5 mr-2" /> Mua lại
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}
