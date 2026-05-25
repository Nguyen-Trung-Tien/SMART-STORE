import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  MapPin, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Info,
  Package,
  Calendar,
  Wallet,
  Building,
  Tag,
  ShoppingBag
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { checkoutService } from "@/features/checkout/services/checkoutService";
import { useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const cubicBezier = [0.32, 0.72, 0, 1];

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Họ và tên là bắt buộc"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(5, "Địa chỉ chi tiết là bắt buộc"),
  city: z.string().min(2, "Thành phố là bắt buộc"),
  district: z.string().min(2, "Quận/Huyện là bắt buộc"),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER", "VNPAY"], {
    required_error: "Vui lòng chọn phương thức thanh toán",
  }),
  shippingMethod: z.enum(["STANDARD", "EXPRESS"], {
    required_error: "Vui lòng chọn phương thức vận chuyển",
  }),
});

// --- Sub-components ---

function ProgressStep({ icon: Icon, label, status, isLast }) {
  return (
    <div className="flex items-center flex-1 last:flex-none">
      <div className="flex flex-col items-center gap-2">
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-500",
          status === "active" ? "bg-primary text-primary-foreground shadow-lg scale-110" : 
          status === "completed" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
        )}>
          {status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
        </div>
        <span className={cn(
          "text-[9px] font-black uppercase tracking-widest whitespace-nowrap",
          status === "active" ? "text-primary" : "text-muted-foreground opacity-50"
        )}>{label}</span>
      </div>
      {!isLast && (
        <div className="flex-1 h-[2px] bg-muted mx-4 -translate-y-3">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: status === "completed" ? "100%" : "0%" }}
            className="h-full bg-emerald-500"
          />
        </div>
      )}
    </div>
  );
}

function OrderSummaryItem({ item }) {
  return (
    <div className="flex gap-4 py-3 border-b border-black/5 dark:border-white/5 last:border-0">
      <div className="relative h-16 w-16 flex-shrink-0 bg-muted/30 rounded-xl overflow-hidden border">
        <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-black shadow-lg">
          {item.amount}
        </span>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
        <h4 className="text-xs font-bold truncate leading-tight">{item.name}</h4>
        <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">
           {item.discount > 0 && <span className="text-primary">-{item.discount}%</span>}
        </p>
      </div>
      <div className="flex flex-col items-end justify-center">
         <span className="text-sm font-black tracking-tight">
           {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * (1 - item.discount/100) * item.amount)}
         </span>
      </div>
    </div>
  );
}

// --- Main Page Component ---

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, selectedItems, removeSelectedItems } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1); 

  // Filter only selected items for this checkout session
  const activeCheckoutItems = useMemo(() => 
    cartItems.filter(item => selectedItems.includes(item.product)),
    [cartItems, selectedItems]
  );

  const subtotal = useMemo(() => activeCheckoutItems.reduce((total, item) => total + item.price * item.amount, 0), [activeCheckoutItems]);
  const totalDiscount = useMemo(() => activeCheckoutItems.reduce((total, item) => total + (item.price * item.discount / 100) * item.amount, 0), [activeCheckoutItems]);
  
  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: user?.address || "",
      city: user?.city || "",
      district: "",
      paymentMethod: "COD",
      shippingMethod: "STANDARD",
    },
  });

  const selectedShipping = form.watch("shippingMethod");
  const shippingPrice = useMemo(() => {
    if (selectedShipping === "EXPRESS") return 50000;
    return subtotal > 500000 ? 0 : 30000;
  }, [selectedShipping, subtotal]);

  const totalPrice = subtotal - totalDiscount + shippingPrice;

  const mutation = useMutation({
    mutationFn: (data) => checkoutService.createOrder(data, user?._id),
    onSuccess: (data) => {
      if (data.status === "OK") {
        toast.success("Đặt hàng thành công!");
        removeSelectedItems(user?._id);
        navigate("/order-success");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Đặt hàng thất bại, vui lòng thử lại");
    },
  });

  function onSubmit(values) {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt hàng");
      navigate("/login");
      return;
    }

    const orderData = {
      orderItems: activeCheckoutItems.map(item => ({
        name: item.name,
        amount: item.amount,
        image: item.image,
        price: item.price,
        product: item.product,
        discount: item.discount
      })),
      paymentMethod: values.paymentMethod,
      itemsPrice: subtotal,
      shippingPrice: shippingPrice,
      totalPrice: totalPrice,
      fullName: values.fullName,
      address: `${values.address}, ${values.district}, ${values.city}`,
      city: values.city,
      phone: values.phone,
      user: user._id,
      email: values.email
    };

    mutation.mutate(orderData);
  }

  if (activeCheckoutItems.length === 0) {
    return (
       <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-6">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
             <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-black">Chưa chọn sản phẩm thanh toán</h2>
          <p className="text-muted-foreground text-center max-w-xs">Vui lòng quay lại giỏ hàng và chọn các sản phẩm bạn muốn mua ngay.</p>
          <Button asChild rounded="full" className="rounded-full h-12 px-8 font-black uppercase text-[10px] tracking-widest">
             <Link to="/cart">Quay lại giỏ hàng</Link>
          </Button>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] pb-24">
      <div className="container max-w-[1280px] mx-auto px-6 py-10 md:py-16">
        
        {/* Progress Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-16">
           <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight italic">Checkout</h1>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                 <ShieldCheck className="h-3.5 w-3.5" /> Giao dịch được bảo mật bởi SSL
              </div>
           </div>

           <div className="flex-1 max-w-xl flex items-center">
              <ProgressStep icon={ShoppingBag} label="Giỏ hàng" status="completed" />
              <ProgressStep icon={Truck} label="Vận chuyển" status={step === 1 ? "active" : "completed"} />
              <ProgressStep icon={CreditCard} label="Thanh toán" status={step === 2 ? "active" : step > 2 ? "completed" : "pending"} isLast />
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Form - 8 cols */}
          <div className="lg:col-span-8 space-y-8">
            <Form {...form}>
              <form className="space-y-8">
                
                {/* Step 1: Shipping Info */}
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div 
                      key="shipping"
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                      className="space-y-8"
                    >
                      <Card className="bg-white dark:bg-neutral-900 border-none ring-1 ring-black/5 shadow-sm rounded-2xl">
                        <CardContent className="p-8 space-y-8">
                          <div className="flex items-center gap-3 border-b border-black/5 pb-6">
                             <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                <MapPin className="h-5 w-5" />
                             </div>
                             <h2 className="text-xl font-black tracking-tight">Thông tin nhận hàng</h2>
                          </div>

                          <div className="grid gap-6 md:grid-cols-2">
                             <FormField control={form.control} name="fullName" render={({ field }) => (
                               <FormItem>
                                 <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Họ và tên</FormLabel>
                                 <FormControl>
                                   <Input className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium" placeholder="Nguyễn Văn A" {...field} />
                                 </FormControl>
                                 <FormMessage className="text-[10px]" />
                               </FormItem>
                             )} />
                             <FormField control={form.control} name="phone" render={({ field }) => (
                               <FormItem>
                                 <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Số điện thoại</FormLabel>
                                 <FormControl>
                                   <Input className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium" placeholder="0901234567" {...field} />
                                 </FormControl>
                                 <FormMessage className="text-[10px]" />
                               </FormItem>
                             )} />
                          </div>

                          <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email nhận thông báo</FormLabel>
                              <FormControl>
                                <Input className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium" placeholder="name@example.com" {...field} />
                              </FormControl>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )} />

                          <div className="grid gap-6 md:grid-cols-2">
                             <FormField control={form.control} name="city" render={({ field }) => (
                               <FormItem>
                                 <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tỉnh / Thành phố</FormLabel>
                                 <FormControl>
                                   <Input className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium" placeholder="Hồ Chí Minh" {...field} />
                                 </FormControl>
                                 <FormMessage className="text-[10px]" />
                               </FormItem>
                             )} />
                             <FormField control={form.control} name="district" render={({ field }) => (
                               <FormItem>
                                 <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quận / Huyện</FormLabel>
                                 <FormControl>
                                   <Input className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium" placeholder="Quận 1" {...field} />
                                 </FormControl>
                                 <FormMessage className="text-[10px]" />
                               </FormItem>
                             )} />
                          </div>

                          <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Địa chỉ chi tiết</FormLabel>
                              <FormControl>
                                <Input className="h-12 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium" placeholder="Số nhà, tên đường..." {...field} />
                              </FormControl>
                              <FormMessage className="text-[10px]" />
                            </FormItem>
                          )} />
                        </CardContent>
                      </Card>

                      <Card className="bg-white dark:bg-neutral-900 border-none ring-1 ring-black/5 shadow-sm rounded-2xl">
                         <CardContent className="p-8 space-y-8">
                            <div className="flex items-center gap-3 border-b border-black/5 pb-6">
                               <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                  <Truck className="h-5 w-5" />
                               </div>
                               <h2 className="text-xl font-black tracking-tight">Phương thức vận chuyển</h2>
                            </div>

                            <FormField control={form.control} name="shippingMethod" render={({ field }) => (
                               <FormItem>
                                  <FormControl>
                                     <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className={cn(
                                           "relative p-5 rounded-2xl border-2 transition-all cursor-pointer",
                                           field.value === "STANDARD" ? "border-primary bg-primary/5 shadow-sm" : "border-black/5 hover:border-black/10"
                                        )}>
                                           <RadioGroupItem value="STANDARD" id="standard" className="sr-only" />
                                           <Label htmlFor="standard" className="cursor-pointer flex flex-col gap-1">
                                              <span className="text-sm font-black tracking-tight uppercase">Giao hàng Tiêu chuẩn</span>
                                              <span className="text-[11px] font-medium text-muted-foreground">Từ 3 - 5 ngày làm việc</span>
                                              <span className="text-xs font-black mt-2 text-primary">
                                                 {subtotal > 500000 ? "Miễn phí" : "30.000₫"}
                                              </span>
                                           </Label>
                                           {field.value === "STANDARD" && <CheckCircle2 className="absolute right-4 top-4 h-4 w-4 text-primary" />}
                                        </div>

                                        <div className={cn(
                                           "relative p-5 rounded-2xl border-2 transition-all cursor-pointer",
                                           field.value === "EXPRESS" ? "border-primary bg-primary/5 shadow-sm" : "border-black/5 hover:border-black/10"
                                        )}>
                                           <RadioGroupItem value="EXPRESS" id="express" className="sr-only" />
                                           <Label htmlFor="express" className="cursor-pointer flex flex-col gap-1">
                                              <span className="text-sm font-black tracking-tight uppercase">Giao hàng Hỏa tốc</span>
                                              <span className="text-[11px] font-medium text-muted-foreground">Nhận hàng trong 24h</span>
                                              <span className="text-xs font-black mt-2 text-primary">50.000₫</span>
                                           </Label>
                                           {field.value === "EXPRESS" && <CheckCircle2 className="absolute right-4 top-4 h-4 w-4 text-primary" />}
                                        </div>
                                     </RadioGroup>
                                  </FormControl>
                               </FormItem>
                            )} />
                         </CardContent>
                      </Card>

                      <div className="flex justify-between items-center">
                         <Link to="/cart" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Trở lại giỏ hàng
                         </Link>
                         <Button type="button" onClick={() => setStep(2)} className="h-14 px-12 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-primary/20 active:scale-95 transition-all">
                            Tiếp tục thanh toán <ChevronRight className="ml-2 h-4 w-4" />
                         </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Payment */}
                  {step === 2 && (
                    <motion.div 
                      key="payment"
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                       <Card className="bg-white dark:bg-neutral-900 border-none ring-1 ring-black/5 shadow-sm rounded-2xl">
                          <CardContent className="p-8 space-y-8">
                             <div className="flex items-center gap-3 border-b border-black/5 pb-6">
                                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                   <CreditCard className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight">Phương thức thanh toán</h2>
                             </div>

                             <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                                <FormItem>
                                   <FormControl>
                                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-4">
                                         {[
                                            { id: "COD", label: "Thanh toán khi nhận hàng (COD)", desc: "Trả tiền mặt khi Shipper giao hàng", icon: Wallet },
                                            { id: "VNPAY", label: "Cổng thanh toán VNPAY", desc: "Thanh toán qua ứng dụng ngân hàng, QR Code", icon: Building },
                                            { id: "BANK_TRANSFER", label: "Chuyển khoản ngân hàng", desc: "Thông tin chuyển khoản sẽ hiển thị sau khi đặt", icon: CreditCard }
                                         ].map((method) => (
                                            <div key={method.id} className={cn(
                                               "relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-5",
                                               field.value === method.id ? "border-primary bg-primary/5 shadow-sm" : "border-black/5 hover:border-black/10"
                                            )}>
                                               <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                                               <div className="h-12 w-12 rounded-xl bg-white dark:bg-neutral-800 border flex items-center justify-center">
                                                  <method.icon className="h-6 w-6 text-muted-foreground" />
                                               </div>
                                               <Label htmlFor={method.id} className="cursor-pointer flex flex-col gap-0.5">
                                                  <span className="text-sm font-black tracking-tight">{method.label}</span>
                                                  <span className="text-[11px] font-medium text-muted-foreground">{method.desc}</span>
                                               </Label>
                                               {field.value === method.id && <CheckCircle2 className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />}
                                            </div>
                                         ))}
                                      </RadioGroup>
                                   </FormControl>
                                </FormItem>
                             )} />
                          </CardContent>
                       </Card>

                       <div className="flex justify-between items-center">
                          <Button type="button" variant="ghost" onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                             <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" /> Thông tin vận chuyển
                          </Button>
                          <Button type="button" onClick={form.handleSubmit(onSubmit)} className="h-14 px-12 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-primary/20 active:scale-95 transition-all" disabled={mutation.isPending}>
                             {mutation.isPending ? "Đang xử lý..." : "Xác nhận đặt hàng"} <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Form>

            {/* Reassurance */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
               {[
                 { icon: Lock, text: "Bảo mật thanh toán" },
                 { icon: ShieldCheck, text: "Chính hãng 100%" },
                 { icon: Calendar, text: "Đổi trả 7 ngày" },
                 { icon: Info, text: "Hỗ trợ 24/7" }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center text-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                    <item.icon className="h-5 w-5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{item.text}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Sticky Summary - 4 cols */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <Card className="bg-white dark:bg-neutral-900 border-none ring-1 ring-black/5 dark:ring-white/10 shadow-2xl rounded-[2rem] overflow-hidden">
               <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-black/5 pb-4">
                     <h3 className="text-lg font-black tracking-tight flex items-center gap-2 italic">
                        Tóm tắt đơn hàng <Badge variant="secondary" className="rounded-md px-1.5 py-0 h-4 text-[9px] font-black">{activeCheckoutItems.length}</Badge>
                     </h3>
                     <Link to="/cart" className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline">Chỉnh sửa</Link>
                  </div>

                  <div className="max-h-[300px] overflow-auto pr-2 no-scrollbar scrollbar-hide">
                     {activeCheckoutItems.map((item, idx) => (
                        <OrderSummaryItem key={idx} item={item} />
                     ))}
                  </div>

                  <div className="space-y-4 pt-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mã ưu đãi</label>
                        <div className="flex gap-2">
                           <div className="relative flex-1">
                              <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                              <Input placeholder="SMART2026" className="h-11 pl-9 rounded-xl text-xs font-bold bg-muted/30 border-none outline-none focus-visible:ring-1 focus-visible:ring-primary/20" />
                           </div>
                           <Button variant="outline" className="h-11 rounded-xl border-2 font-black text-[10px] uppercase px-4">Áp dụng</Button>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3 border-t border-black/5 pt-6">
                     <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span>Tạm tính</span>
                        <span className="text-foreground font-bold">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subtotal)}</span>
                     </div>
                     <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span>Ưu đãi sản phẩm</span>
                        <span className="text-destructive font-bold">-{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalDiscount)}</span>
                     </div>
                     <div className="flex justify-between text-xs font-medium text-muted-foreground">
                        <span>Vận chuyển ({selectedShipping === "EXPRESS" ? "Hỏa tốc" : "Tiêu chuẩn"})</span>
                        <span className="text-foreground font-bold">
                           {shippingPrice === 0 ? "Miễn phí" : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(shippingPrice)}
                        </span>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-black/5 dark:border-white/5">
                    <div className="flex justify-between items-end mb-2">
                       <div className="space-y-0.5">
                          <span className="text-sm font-black uppercase tracking-widest">Tổng cộng</span>
                          <p className="text-[9px] text-muted-foreground font-bold italic opacity-60">*Giá đã gồm thuế VAT</p>
                       </div>
                       <span className="text-3xl font-black text-primary tracking-tighter">
                         {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}
                       </span>
                    </div>
                  </div>
               </CardContent>
            </Card>

            <div className="p-6 rounded-[1.5rem] bg-muted/30 flex flex-col gap-4">
               <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Dự kiến nhận hàng</span>
               </div>
               <p className="text-xs font-medium text-muted-foreground italic">
                  Giao hàng dự kiến từ <span className="font-bold text-foreground">2 - 5 ngày</span> sau khi xác nhận đơn hàng thành công.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t p-4 md:hidden flex items-center justify-between">
         <div className="flex flex-col">
            <span className="text-[8px] font-black text-muted-foreground uppercase">Tổng thanh toán</span>
            <span className="text-xl font-black text-primary tracking-tighter">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}
            </span>
         </div>
         <Button 
            className="h-12 px-8 font-black text-xs uppercase tracking-widest" 
            onClick={step === 1 ? () => setStep(2) : form.handleSubmit(onSubmit)}
            disabled={mutation.isPending}
          >
            {step === 1 ? "Thanh toán" : "Xác nhận"}
         </Button>
      </div>
    </div>
  );
}
