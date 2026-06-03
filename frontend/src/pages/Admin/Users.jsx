import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/table/DataTable";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useUsers, useDeleteUser, useChangeRole } from "@/hooks/api/useUsers";
import { formatDate } from "@/lib/formatter";
import { toast } from "@/components/ui/sonner";

export default function AdminUsersPage() {
  const usersQuery = useUsers();
  const deleteUser = useDeleteUser();
  const changeRole = useChangeRole();

  const [selectedUser, setSelectedUser] = useState(null);
  const deleteDialog = useDisclosure(false);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await changeRole.mutateAsync({ id: userId, role: newRole });
      toast.success("Role updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to update role.");
    }
  };

  const columns = useMemo(
    () => [
      { key: "name", header: "Name" },
      { key: "email", header: "Email" },
      { key: "phone", header: "Phone" },
      { 
        key: "role", 
        header: "Role", 
        render: (row) => (
          <Select 
            defaultValue={row.role || (row.isAdmin ? "Admin" : "User")} 
            onValueChange={(val) => handleRoleChange(row._id, val)}
          >
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Customer Support">Customer Support</SelectItem>
              <SelectItem value="Product Manager">Product Manager</SelectItem>
            </SelectContent>
          </Select>
        ) 
      },
      { key: "createdAt", header: "Joined", render: (row) => formatDate(row.createdAt) },
      {
        key: "actions",
        header: "Actions",
        render: (row) => (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              setSelectedUser(row);
              deleteDialog.open();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [deleteDialog, handleRoleChange]
  );

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(selectedUser._id);
      toast.success("User deleted.");
      deleteDialog.close();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to delete user.");
    }
  };

  return (
    <div className="space-y-8 page-enter">
      <PageHeader eyebrow="Admin" title="Users & Roles" description="Manage system users and assign role-based permissions." />
      <DataTable columns={columns} rows={usersQuery.users || []} />

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(value) => (value ? deleteDialog.open() : deleteDialog.close())}
        title="Delete User"
        description={`This will permanently remove ${selectedUser?.name || "this user"}.`}
        onConfirm={handleDelete}
        loading={deleteUser.isPending}
      />
    </div>
  );
}
