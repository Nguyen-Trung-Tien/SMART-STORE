import { useUserOrders } from "@/features/orders/hooks/useOrders";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  RefreshCcw,
  MapPin,
  CreditCard,
  Calendar,
  History,
  AlertCircle,
  ArrowRight,
  ShoppingBag
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { orderService } from "@/features/orders/services/orderService";

const cubicBezier = [0.32, 0.72, 0, 1];

const statusConfig = {
  All: { label: "Tất cả", color: "bg-primary/10 text-primary" },
  Pending: { label: "Chờ xử lý", color: "bg-amber-500/10 text-amber-600", icon: Clock },
  Processing: { label: "Đang xử lý", color: "bg-blue-500/10 text-blue-600", icon: Package },
  Shipped: { label: "Đang giao", color: "bg-indigo-500/10 text-indigo-600", icon: Truck },
  Delivered: { label: "Đã giao", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
  Cancelled: { label: "Đã hủy", color: "bg-rose-500/10 text-rose-600", icon: XCircle },
};

// --- Sub-components ---

function OrderSummaryCard({ icon: Icon, label, count, color }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border ring-1 ring-black/5 shadow-sm">
      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="text-lg font-black tracking-tight">{count}</span>
      </div>
    </div>
  );
}

function OrderStatusTimeline({ currentStatus }) {
  const steps = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentIdx = steps.indexOf(currentStatus);
  
  if (currentStatus === "Cancelled") {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/5 text-rose-600 border border-rose-500/10">
        <AlertCircle className="h-4 w-4" />
        <span className="text-xs font-bold uppercase tracking-widest">Đơn hàng này đã bị hủy</span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-between w-full py-2">
      {steps.map((step, idx) => {
        const Icon = statusConfig[step].icon;
        const isActive = idx <= currentIdx;
        const isLast = idx === steps.length - 1;

        return (
          <div key={step} className="relative flex flex-col items-center flex-1">
            <div className={cn(
              "z-10 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-500",
              isActive ? "bg-primary text-primary-foreground shadow-md scale-105" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span className={cn(
              "absolute -bottom-5 text-[8px] font-black uppercase tracking-tighter",
              isActive ? "text-primary" : "text-muted-foreground opacity-40"
            )}>
              {statusConfig[step].label}
            </span>
            {!isLast && (
              <div className="absolute left-[50%] top-3.5 w-full h-[1.5px] bg-muted -translate-y-1/2">
                <div className={cn("h-full bg-primary transition-all duration-700", idx < currentIdx ? "w-full" : "w-0")} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderItem({ item }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b last:border-0 border-black/5 dark:border-white/5">
      <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted flex-shrink-0 border">
        <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold truncate leading-tight">{item.name}</h4>
        <p className="text-[9px] font-black text-muted-foreground mt-1 uppercase tracking-widest opacity-60">Số lượng: {item.amount}</p>
      </div>
      <div className="text-right">
        <span className="text-xs font-black tracking-tight">
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
        </span>
      </div>
    </div>
  );
}

function OrderDetailsSheet({ order }) {
  const handleDownloadInvoice = async () => {
    try {
      const response = await orderService.downloadInvoice(order._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order._id.slice(-6).toUpperCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast.success("Đã tải hóa đơn thành công");
    } catch (error) {
      toast.error("Không thể tải hóa đơn");
    }
  };

  return (
    <SheetContent className="sm:max-w-[440px] rounded-l-2xl border-none bg-[#FAFAFA] dark:bg-[#0A0A0A] p-0 overflow-hidden shadow-2xl">
      <div className="h-full flex flex-col">
        <SheetHeader className="p-6 bg-white dark:bg-neutral-900 border-b relative">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
               <Badge variant="secondary" className={cn("rounded-md text-[8px] font-black uppercase tracking-widest", statusConfig[order.status]?.color)}>
                  {statusConfig[order.status]?.label}
               </Badge>
               <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">#{order._id.slice(-8).toUpperCase()}</span>
            </div>
            <SheetTitle className="text-xl font-black tracking-tight">Chi tiết đơn hàng</SheetTitle>
            <SheetDescription className="text-[10px] font-bold uppercase tracking-widest opacity-50">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</SheetDescription>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-6 space-y-6 no-scrollbar scrollbar-hide">
          {/* Tracking */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border ring-1 ring-black/5 shadow-sm space-y-6 pb-8">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Vận chuyển</h3>
            <OrderStatusTimeline currentStatus={order.status} />
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border ring-1 ring-black/5 shadow-sm space-y-3">
             <h3 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Sản phẩm</h3>
             <div className="divide-y divide-black/5 dark:divide-white/5">
               {order.orderItems.map((item, idx) => (
                 <OrderItem key={idx} item={item} />
               ))}
             </div>
          </div>

          {/* Info */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border ring-1 ring-black/5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-primary">
                 <MapPin className="h-3.5 w-3.5" />
                 <h3 className="text-[9px] font-black uppercase tracking-widest">Giao hàng</h3>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold truncate">{order.shippingAddress.fullName}</p>
                <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                <p className="text-[10px] font-bold pt-1 opacity-70">{order.shippingAddress.phone}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border ring-1 ring-black/5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-primary">
                 <CreditCard className="h-3.5 w-3.5" />
                 <h3 className="text-[9px] font-black uppercase tracking-widest">Thanh toán</h3>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold uppercase">{order.paymentMethod}</p>
                <p className={cn("text-[10px] font-black uppercase tracking-widest", order.isPaid ? "text-emerald-500" : "text-amber-500")}>
                  {order.isPaid ? "Đã trả tiền" : "Chờ trả tiền"}
                </p>
              </div>
            </div>
          </div>

          {/* Billing */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border ring-1 ring-black/5 shadow-sm space-y-3">
             <div className="space-y-2.5">
                <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                   <span>Tạm tính</span>
                   <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.itemsPrice)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                   <span>Phí vận chuyển</span>
                   <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.shippingPrice)}</span>
                </div>
                <div className="h-px bg-black/5 dark:bg-white/5" />
                <div className="flex justify-between items-center pt-1">
                   <span className="text-xs font-black uppercase tracking-widest">Tổng cộng</span>
                   <span className="text-lg font-black text-primary tracking-tighter">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalPrice)}
                   </span>
                </div>
             </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-neutral-900 border-t flex gap-3 mt-auto">
           <Button variant="outline" className="flex-1 h-11 rounded-lg font-black text-[9px] uppercase tracking-widest border-2" onClick={handleDownloadInvoice}>
              <Download className="h-3.5 w-3.5 mr-2" /> Hóa đơn
           </Button>
           <Button className="flex-1 h-11 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg shadow-primary/10">
              <RefreshCcw className="h-3.5 w-3.5 mr-2" /> Mua lại
           </Button>
        </div>
      </div>
    </SheetContent>
  );
}

function OrderCard({ order }) {
  const status = statusConfig[order.status] || statusConfig.Pending;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.div 
          whileHover={{ y: -2, shadow: "0 10px 20px rgba(0,0,0,0.05)" }}
          className="group relative bg-white dark:bg-neutral-900 rounded-xl border ring-1 ring-black/5 p-4 flex flex-col md:flex-row items-center gap-4 cursor-pointer transition-all"
        >
          {/* Main Info */}
          <div className="flex flex-1 items-center gap-4 w-full min-w-0">
            <div className="relative h-14 w-14 rounded-lg bg-muted overflow-hidden flex-shrink-0 border">
              <img src={order.orderItems[0].image} alt="thumb" className="h-full w-full object-contain p-1" />
              {order.orderItems.length > 1 && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-white font-black text-[10px]">
                  +{order.orderItems.length - 1}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1 min-w-0">
               <div className="flex items-center gap-2">
                 <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">#{order._id.slice(-8).toUpperCase()}</span>
                 <Badge variant="outline" className={cn("rounded-md px-1.5 py-0 h-4 text-[8px] font-black uppercase tracking-widest border-none", status.color)}>
                    {status.label}
                 </Badge>
               </div>
               <h3 className="font-bold text-xs md:text-sm truncate leading-tight group-hover:text-primary transition-colors pr-4">
                  {order.orderItems.map(item => item.name).join(", ")}
               </h3>
               <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span className="flex items-center gap-1"><Package className="h-2.5 w-2.5" /> {order.orderItems.length} SP</span>
               </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between md:justify-end md:gap-8 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
            <div className="flex flex-col md:items-end">
               <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Tổng thanh toán</span>
               <span className="text-base font-black tracking-tight text-primary leading-none mt-0.5">
                 {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalPrice)}
               </span>
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all opacity-40 group-hover:opacity-100">
               <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </motion.div>
      </SheetTrigger>
      <OrderDetailsSheet order={order} />
    </Sheet>
  );
}

// --- Main Page ---

export default function MyOrdersPage() {
  const { user } = useAuthStore();
  const { data: ordersData, isLoading } = useUserOrders(user?._id);
  const [activeTab, setActiveTab] = useState("All");

  const orders = ordersData?.data || [];

  const stats = useMemo(() => {
    return {
      Total: orders.length,
      Pending: orders.filter(o => o.status === "Pending" || o.status === "Processing").length,
      Delivered: orders.filter(o => o.status === "Delivered").length,
      Cancelled: orders.filter(o => o.status === "Cancelled").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (activeTab === "Processing") {
      result = orders.filter(o => o.status === "Pending" || o.status === "Processing");
    } else if (activeTab !== "All") {
      result = orders.filter(o => o.status === activeTab);
    }
    return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, activeTab]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] pb-24">
      <div className="container max-w-[1140px] mx-auto px-6 py-10 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">
               <History className="h-3 w-3" /> Tài khoản
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight italic">Lịch sử đơn hàng</h1>
            <p className="text-xs text-muted-foreground font-medium">Theo dõi và quản lý các giao dịch của bạn tại Smart Store.</p>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="relative group hidden sm:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
               <input 
                  type="text" placeholder="Tìm mã đơn hàng..."
                  className="pl-9 h-10 w-[200px] rounded-lg bg-white dark:bg-neutral-900 border ring-1 ring-black/5 focus:ring-primary/20 outline-none text-[11px] font-bold transition-all"
               />
             </div>
             <Button variant="outline" size="sm" className="h-10 rounded-lg border-2 font-black text-[9px] uppercase tracking-widest gap-2">
                <Filter className="h-3.5 w-3.5" /> Bộ lọc
             </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
           <OrderSummaryCard icon={Package} label="Tổng đơn" count={stats.Total} color="bg-primary/10 text-primary" />
           <OrderSummaryCard icon={Clock} label="Đang xử lý" count={stats.Pending} color="bg-amber-500/10 text-amber-600" />
           <OrderSummaryCard icon={CheckCircle2} label="Thành công" count={stats.Delivered} color="bg-emerald-500/10 text-emerald-600" />
           <OrderSummaryCard icon={XCircle} label="Đã hủy" count={stats.Cancelled} color="bg-rose-500/10 text-rose-600" />
        </div>

        {/* Main List */}
        <div className="space-y-6">
           <Tabs defaultValue="All" onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 overflow-x-auto no-scrollbar">
                <TabsList className="bg-transparent h-auto p-0 gap-6 md:gap-8 flex-nowrap">
                  {Object.keys(statusConfig).slice(0, 6).map((key) => (
                    <TabsTrigger 
                       key={key} value={key}
                       className="p-0 h-auto bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none relative group whitespace-nowrap"
                    >
                       <span className="text-[10px] font-black uppercase tracking-widest pb-3">{statusConfig[key].label}</span>
                       <motion.div 
                          className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-t-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity"
                          layoutId="activeTabOrder"
                       />
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="mt-8 space-y-3">
                 {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                       <Skeleton key={i} className="h-24 w-full rounded-xl" />
                    ))
                 ) : filteredOrders.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                       {filteredOrders.map((order) => (
                         <motion.div 
                            key={order._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                         >
                            <OrderCard order={order} />
                         </motion.div>
                       ))}
                    </AnimatePresence>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-black/10">
                       <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-lg font-black tracking-tight italic">Chưa có đơn hàng nào</h3>
                          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">Hãy lấp đầy giỏ hàng của bạn ngay.</p>
                       </div>
                       <Button asChild className="h-11 px-8 rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl shadow-primary/20 mt-4">
                          <Link to="/products">Mua sắm ngay <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
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
