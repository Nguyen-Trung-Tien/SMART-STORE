import { PageHeader } from "@/components/common/PageHeader";
import { QueryBoundary } from "@/components/feedback/QueryBoundary";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/formatter";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/features/order/hooks/useOrders";

export default function OrdersPage() {
  const { user } = useAuth();
  const query = useOrders(user?._id || user?.id);

  return (
    <div className="space-y-8 page-enter">
      <PageHeader eyebrow="Protected route" title="Orders" description="Server state is fetched per-user and cached by query key." />
      <QueryBoundary query={query} isEmpty={!query.data?.length} emptyProps={{ title: "No orders yet", description: "Your recent purchases will appear here." }}>
        <div className="space-y-4">
          {query.data?.map((order) => (
            <Card key={order._id}>
              <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-bold">Order #{order._id?.slice(-6)?.toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={order.isDelivered ? "success" : "secondary"}>{order.isDelivered ? "Delivered" : "Processing"}</Badge>
                  <p className="text-lg font-bold">{formatCurrency(order.totalPrice)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </QueryBoundary>
    </div>
  );
}
