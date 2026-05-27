import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { useAdminOrders } from "@/features/order/hooks/useOrders";
import { useProducts } from "@/features/product/hooks/useProducts";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user.api";
import { queryKeys } from "@/config/constants";

export default function AdminDashboardPage() {
  const productsQuery = useProducts({ limit: 8, page: 0 });
  const ordersQuery = useAdminOrders();
  const usersQuery = useQuery({
    queryKey: queryKeys.users,
    queryFn: userApi.list,
    select: (response) => response?.data || [],
  });

  return (
    <div className="space-y-8 page-enter">
      <PageHeader eyebrow="Admin" title="Dashboard" description="A lightweight admin landing page backed by live query data." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Products" value={productsQuery.data?.total || 0} hint="Catalog items available" />
        <StatCard title="Orders" value={ordersQuery.data?.length || 0} hint="Orders across all users" />
        <StatCard title="Users" value={usersQuery.data?.length || 0} hint="Registered accounts" />
        <StatCard title="Revenue" value={`$${(ordersQuery.data || []).reduce((sum, order) => sum + (order.totalPrice || 0), 0)}`} hint="Tracked from order totals" />
      </div>
    </div>
  );
}
