import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatter";
import { removeFromCart, updateCartQuantity } from "@/store/slices/cartSlice";
import { routePaths } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const items = useSelector((state) => state.cart.items);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!items.length) {
    return <EmptyState title="Your cart is empty" description="Add products to start a checkout flow." actionLabel="Browse products" onAction={() => navigate(routePaths.products)} />;
  }

  return (
    <div className="space-y-8 page-enter">
      <PageHeader eyebrow="Cart" title="Review your basket" description="Client state lives in Redux Toolkit with local persistence." />
      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item._id}>
              <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                <div className="flex-1 space-y-1">
                  <Link to={`/product/${item._id}`} className="text-lg font-bold">
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{formatCurrency(item.price)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => dispatch(updateCartQuantity({ productId: item._id, quantity: item.quantity - 1 }))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-semibold">{item.quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => dispatch(updateCartQuantity({ productId: item._id, quantity: item.quantity + 1 }))}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => dispatch(removeFromCart(item._id))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="h-fit">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-2xl font-extrabold">{formatCurrency(subtotal)}</span>
            </div>
            <Button className="w-full" onClick={() => navigate(isAuthenticated ? routePaths.checkout : routePaths.login)}>
              {isAuthenticated ? "Proceed to checkout" : "Sign in to checkout"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
