import { useState } from "react";
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
import { useApplyVoucher } from "@/hooks/api/useVoucher";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const items = useSelector((state) => state.cart.items);
  const createOrder = useCreateOrder(user?._id || user?.id);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  const applyVoucher = useApplyVoucher();

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

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error("Voucher code cannot be empty.");
      return;
    }
    try {
      const response = await applyVoucher.mutateAsync({
        code: voucherCode.trim(),
        orderValue: subtotal,
      });

      if (response?.status === "ERR") {
        toast.error(response.message || "Invalid voucher code.");
        setAppliedVoucher(null);
      } else {
        toast.success("Voucher applied successfully.");
        setAppliedVoucher(response.data);
      }
    } catch (error) {
      toast.error(error.message || "Failed to apply voucher.");
      setAppliedVoucher(null);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
  };

  const onSubmit = async (values) => {
    try {
      const discountPrice = appliedVoucher ? appliedVoucher.discountAmount : 0;
      const totalPrice = appliedVoucher ? Math.max(0, subtotal - appliedVoucher.discountAmount) : subtotal;
      const couponCode = appliedVoucher ? appliedVoucher.code : undefined;

      await createOrder.mutateAsync({
        ...values,
        itemsPrice: subtotal,
        shippingPrice: 0,
        discountPrice,
        totalPrice,
        couponCode,
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

            {/* Voucher input form section */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter voucher code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  disabled={applyVoucher.isPending || !!appliedVoucher}
                  className="h-9"
                />
                <Button
                  type="button"
                  onClick={handleApplyVoucher}
                  disabled={applyVoucher.isPending || !voucherCode.trim() || !!appliedVoucher}
                  className="h-9"
                >
                  {applyVoucher.isPending ? "Applying..." : "Apply"}
                </Button>
              </div>
            </div>

            {/* Applied voucher display */}
            {appliedVoucher && (
              <div className="flex items-center justify-between text-sm text-green-600 bg-green-50 dark:bg-green-950/20 p-2 rounded">
                <span>Discount ({appliedVoucher.code}): -{formatCurrency(appliedVoucher.discountAmount)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveVoucher}
                  className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  Remove
                </Button>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="text-2xl font-extrabold">
                  {formatCurrency(
                    appliedVoucher
                      ? Math.max(0, subtotal - appliedVoucher.discountAmount)
                      : subtotal
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
