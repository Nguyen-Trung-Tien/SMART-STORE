import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/common/PageHeader";
import { checkoutSchema } from "@/lib/validators";
import { formatCurrency } from "@/lib/formatter";
import { useAuth } from "@/hooks/useAuth";
import { useCreateOrder } from "@/features/order/hooks/useOrders";
import { clearCart } from "@/store/slices/cartSlice";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const items = useSelector((state) => state.cart.items);
  const createOrder = useCreateOrder(user?._id || user?.id);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || "",
      address: "",
      city: "",
      phone: user?.phone || "",
      email: user?.email || "",
      paymentMethod: "COD",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (values) => {
    try {
      await createOrder.mutateAsync({
        ...values,
        itemsPrice: subtotal,
        shippingPrice: 0,
        totalPrice: subtotal,
        orderItems: items,
      });
      dispatch(clearCart());
      toast.success("Order placed successfully.");
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to place order.");
    }
  };

  return (
    <div className="space-y-8 page-enter">
      <PageHeader eyebrow="Protected route" title="Checkout" description="This flow uses RHF + Zod, authenticated mutations, and cart state from Redux." />
      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <Card>
          <CardContent className="p-6">
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
              <FormField label="Full name" error={errors.fullName?.message}>
                <Input {...register("fullName")} />
              </FormField>
              <FormField label="Phone" error={errors.phone?.message}>
                <Input {...register("phone")} />
              </FormField>
              <FormField label="Email" error={errors.email?.message} className="md:col-span-2">
                <Input type="email" {...register("email")} />
              </FormField>
              <FormField label="Address" error={errors.address?.message} className="md:col-span-2">
                <Input {...register("address")} />
              </FormField>
              <FormField label="City" error={errors.city?.message}>
                <Input {...register("city")} />
              </FormField>
              <FormField label="Payment method" error={errors.paymentMethod?.message}>
                <Select value={paymentMethod} onValueChange={(value) => setValue("paymentMethod", value, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COD">Cash on delivery</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <div className="md:col-span-2">
                <Button type="submit" disabled={isSubmitting || createOrder.isPending}>
                  {isSubmitting || createOrder.isPending ? "Placing order..." : "Place order"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="h-fit">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-bold">Order summary</h2>
            {items.map((item) => (
              <div key={item._id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="text-2xl font-extrabold">{formatCurrency(subtotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
