import { useUserOrders } from "@/features/orders/hooks/useOrders";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  History,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { statusConfig } from "@/features/orders/constants";
import { OrderSummaryCard } from "@/features/orders/components/OrderSummaryCard";
import { OrderCard } from "@/features/orders/components/OrderCard";

export default function MyOrdersPage() {
  const { user } = useAuthStore();
  const { data: ordersData, isLoading } = useUserOrders(user?._id);
  const [activeTab, setActiveTab] = useState("All");

  const orders = ordersData?.data || [];

  const stats = useMemo(() => {
    return {
      Total: orders.length,
      Pending: orders.filter(
        (o) => o.status === "Pending" || o.status === "Processing",
      ).length,
      Delivered: orders.filter((o) => o.status === "Delivered").length,
      Cancelled: orders.filter((o) => o.status === "Cancelled").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (activeTab === "Processing") {
      result = orders.filter(
        (o) => o.status === "Pending" || o.status === "Processing",
      );
    } else if (activeTab !== "All") {
      result = orders.filter((o) => o.status === activeTab);
    }
    return [...result].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, [orders, activeTab]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] pb-24">
      <div className="container max-w-[1140px] mx-auto px-4 md:px-6 py-8 md:py-12 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
              <History className="h-3 w-3" /> Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight italic">
              Lịch sử đơn hàng
            </h1>
            <p className="text-xs text-muted-foreground font-medium max-w-md">
              Theo dõi và quản lý các giao dịch công nghệ của bạn.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Mã đơn hàng..."
                className="pl-9 h-10 w-[180px] rounded-lg bg-white dark:bg-neutral-900 border ring-1 ring-black/5 focus:ring-primary/20 outline-none text-[11px] font-bold"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-lg border-2 font-black text-[9px] uppercase tracking-widest gap-2"
            >
              <Filter className="h-3.5 w-3.5" /> Lọc
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <OrderSummaryCard
            icon={Package}
            label="Tất cả"
            count={stats.Total}
            color="bg-primary/10 text-primary"
          />
          <OrderSummaryCard
            icon={Clock}
            label="Đang chờ"
            count={stats.Pending}
            color="bg-amber-500/10 text-amber-600"
          />
          <OrderSummaryCard
            icon={CheckCircle2}
            label="Thành công"
            count={stats.Delivered}
            color="bg-emerald-500/10 text-emerald-600"
          />
          <OrderSummaryCard
            icon={XCircle}
            label="Đã hủy"
            count={stats.Cancelled}
            color="bg-rose-500/10 text-rose-600"
          />
        </div>

        {/* Orders List & Tabs */}
        <div className="space-y-6 max-w-4xl mx-auto w-full">
          <Tabs
            defaultValue="All"
            onValueChange={setActiveTab}
            className="w-full flex flex-col gap-0"
          >
            <div className="border-b border-black/5 dark:border-white/5 overflow-x-auto no-scrollbar scroll-smooth">
              <TabsList className="bg-transparent h-auto p-0 gap-6 md:gap-10 flex-nowrap min-w-max w-full sm:justify-center">
                {Object.keys(statusConfig).map((key) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="p-0 h-auto bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none relative group pb-3"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {statusConfig[key].label}
                    </span>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity"
                      layoutId="activeTabOrderHighlight"
                    />
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="mt-12 space-y-4 w-full">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))
              ) : filteredOrders.length > 0 ? (
                <div className="grid gap-4">
                  {filteredOrders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-5 bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-black/10">
                  <div className="h-14 w-14 rounded-full bg-muted/30 flex items-center justify-center">
                    <ShoppingBag className="h-7 w-7 text-muted-foreground/30" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black tracking-tight italic uppercase opacity-80">
                      Trống trải quá...
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                      Bạn chưa có đơn hàng nào ở mục này.
                    </p>
                  </div>
                  <Button
                    asChild
                    className="h-10 px-8 rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl shadow-primary/20 mt-4"
                  >
                    <Link to="/products">
                      Mua sắm ngay <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
