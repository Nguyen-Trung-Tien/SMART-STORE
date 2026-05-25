import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { checkoutService } from "@/features/checkout/services/checkoutService";
import { useMutation } from "@tanstack/react-query";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Họ và tên là bắt buộc"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Địa chỉ chi tiết là bắt buộc"),
  city: z.string().min(2, "Thành phố là bắt buộc"),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER", "VNPAY"], {
    required_error: "Vui lòng chọn phương thức thanh toán",
  }),
});

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.amount, 0);
  const totalDiscount = cartItems.reduce((total, item) => total + (item.price * item.discount / 100) * item.amount, 0);
  const shippingPrice = subtotal > 500000 ? 0 : 30000;
  const totalPrice = subtotal - totalDiscount + shippingPrice;

  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      paymentMethod: "COD",
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => checkoutService.createOrder(data, user?._id),
    onSuccess: (data) => {
      if (data.status === "OK") {
        toast.success("Đặt hàng thành công!");
        clearCart();
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
      orderItems: cartItems.map(item => ({
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
      address: values.address,
      city: values.city,
      phone: values.phone,
      user: user._id,
      email: user.email
    };

    mutation.mutate(orderData);
  }

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Thanh toán</h1>
      
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin giao hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên</FormLabel>
                          <FormControl>
                            <Input placeholder="Nguyễn Văn A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input placeholder="09xxxxxxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tỉnh/Thành phố</FormLabel>
                        <FormControl>
                          <Input placeholder="Hà Nội" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ chi tiết</FormLabel>
                        <FormControl>
                          <Input placeholder="Số nhà, tên đường, phường/xã..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                              <RadioGroupItem value="COD" id="cod" />
                              <Label htmlFor="cod" className="flex-1 cursor-pointer font-medium">
                                Thanh toán khi nhận hàng (COD)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 cursor-pointer">
                              <RadioGroupItem value="VNPAY" id="vnpay" />
                              <Label htmlFor="vnpay" className="flex-1 cursor-pointer font-medium">
                                Thanh toán qua VNPay
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Button type="submit" className="w-full lg:hidden" size="lg" disabled={mutation.isPending}>
                {mutation.isPending ? "Đang xử lý..." : "Xác nhận đặt hàng"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex gap-3 text-sm">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {item.amount}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <p className="line-clamp-1 font-medium">{item.name}</p>
                      <p className="text-muted-foreground">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giảm giá</span>
                    <span className="text-destructive">-{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalDiscount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(shippingPrice)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-base font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  className="hidden w-full lg:flex" 
                  size="lg" 
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
