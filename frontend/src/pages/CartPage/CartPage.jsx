import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();
  const { user } = useAuthStore();

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.amount, 0);
  const totalDiscount = cartItems.reduce((total, item) => total + (item.price * item.discount / 100) * item.amount, 0);
  const total = subtotal - totalDiscount;
  const shippingPrice = total > 500000 ? 0 : 30000;

  if (cartItems.length === 0) {
    return (
      <main className="container mx-auto flex h-[70vh] flex-col items-center justify-center px-4 py-12">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>
        <h2 className="mt-8 text-3xl font-black tracking-tight">Giỏ hàng đang trống</h2>
        <p className="mt-3 text-muted-foreground text-lg max-w-sm text-center">Đừng bỏ lỡ hàng ngàn ưu đãi hấp dẫn đang chờ đón bạn.</p>
        <Button asChild className="mt-10 h-12 px-10 font-bold shadow-lg shadow-primary/20">
          <Link to="/products">Tiếp tục mua sắm <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-black tracking-tight">Giỏ hàng</h1>
        <Badge variant="secondary" className="h-6 px-3 font-bold">{cartItems.length} sản phẩm</Badge>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-xl border bg-muted/20 p-4 flex items-center gap-3 text-sm">
            <Info className="h-4 w-4 text-primary" />
            <span>Miễn phí vận chuyển cho đơn hàng từ <strong>500.000₫</strong></span>
          </div>

          <div className="space-y-3">
            {cartItems.map((item) => (
              <Card key={item.product} className="group overflow-hidden border-primary/5 hover:border-primary/20 transition-all hover:shadow-sm">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border bg-white p-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="flex flex-1 flex-col min-w-0">
                    <Link to={`/product-details/${item.product}`} className="hover:text-primary transition-colors">
                      <h3 className="font-bold text-base leading-tight line-clamp-1">{item.name}</h3>
                    </Link>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-lg font-black text-primary">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * (1 - item.discount/100))}
                      </span>
                      {item.discount > 0 && (
                        <span className="text-[10px] font-bold text-muted-foreground line-through opacity-60">
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-lg border bg-background p-0.5 shadow-xs">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-md"
                        onClick={() => updateQuantity(item.product, item.amount - 1, user?._id)}
                        disabled={item.amount <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-bold">{item.amount}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-md"
                        onClick={() => updateQuantity(item.product, item.amount + 1, user?._id)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      onClick={() => removeFromCart(item.product, user?._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-primary/10 shadow-lg sticky top-24">
            <CardContent className="p-8">
              <h2 className="text-2xl font-black tracking-tight mb-6">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Tạm tính</span>
                  <span className="font-bold">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Giảm giá sản phẩm</span>
                  <span className="text-destructive font-bold">-{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalDiscount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Phí vận chuyển</span>
                  <span className="font-bold">{shippingPrice === 0 ? "Miễn phí" : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(shippingPrice)}</span>
                </div>
                
                <div className="pt-5 border-t">
                  <div className="flex flex-col gap-3 mb-6">
                    <Label htmlFor="coupon" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Mã giảm giá</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                         <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                         <Input id="coupon" placeholder="SMART2026" className="pl-10 h-11" />
                      </div>
                      <Button variant="outline" className="h-11 font-bold">Áp dụng</Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <span className="font-bold">Tổng cộng</span>
                    <div className="flex flex-col items-end">
                       <span className="text-3xl font-black text-primary">
                         {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total + shippingPrice)}
                       </span>
                       <span className="text-[10px] text-muted-foreground">(Đã bao gồm thuế VAT)</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="mt-8 w-full h-14 text-lg font-black shadow-xl shadow-primary/20" size="lg" asChild>
                <Link to="/checkout">Thanh toán ngay <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Bằng cách đặt hàng, bạn đồng ý với <Link to="/terms" className="underline hover:text-primary">Điều khoản dịch vụ</Link> của chúng tôi.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
