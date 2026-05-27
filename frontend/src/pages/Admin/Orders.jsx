import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/table/DataTable";
import { useAdminOrders } from "@/features/order/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/formatter";

export default function AdminOrdersPage() {
  const query = useAdminOrders();
  const rows = query.data || [];

  const columns = [
    { key: "_id", header: "Order", render: (row) => row._id?.slice(-6)?.toUpperCase() },
    { key: "fullName", header: "Customer" },
    { key: "email", header: "Email" },
    { key: "totalPrice", header: "Total", render: (row) => formatCurrency(row.totalPrice) },
    { key: "createdAt", header: "Created", render: (row) => formatDate(row.createdAt) },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={row.isDelivered ? "success" : "secondary"}>{row.isDelivered ? "Delivered" : "Open"}</Badge>,
    },
  ];

  return (
    <div className="space-y-8 page-enter">
      <PageHeader eyebrow="Admin" title="Orders" description="All orders are fetched through a dedicated admin query." />
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
