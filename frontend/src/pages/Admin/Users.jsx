import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/table/DataTable";
import { userApi } from "@/api/user.api";
import { queryKeys } from "@/config/constants";
import { formatDate } from "@/lib/formatter";

export default function AdminUsersPage() {
  const query = useQuery({
    queryKey: queryKeys.users,
    queryFn: userApi.list,
    select: (response) => response?.data || [],
  });

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "isAdmin", header: "Role", render: (row) => <Badge variant={row.isAdmin ? "success" : "secondary"}>{row.isAdmin ? "Admin" : "Customer"}</Badge> },
    { key: "createdAt", header: "Joined", render: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div className="space-y-8 page-enter">
      <PageHeader eyebrow="Admin" title="Users" description="User administration stays isolated from the public storefront." />
      <DataTable columns={columns} rows={query.data || []} />
    </div>
  );
}
