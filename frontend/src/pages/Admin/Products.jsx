import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/table/DataTable";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { formatCurrency } from "@/lib/formatter";
import { useAdminProductMutations, useProducts } from "@/features/product/hooks/useProducts";

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const productsQuery = useProducts({ limit: 20, page: 0 });
  const { deleteProduct } = useAdminProductMutations();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const deleteDialog = useDisclosure(false);

  const rows = productsQuery.data?.items || [];
  const columns = useMemo(
    () => [
      { key: "name", header: "Name" },
      { key: "type", header: "Type" },
      { key: "price", header: "Price", render: (row) => formatCurrency(row.price) },
      { key: "countInStock", header: "Stock" },
      {
        key: "actions",
        header: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                navigate(`/admin/products/${row._id}/edit`);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                setSelectedProduct(row);
                deleteDialog.open();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [deleteDialog, navigate]
  );

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(selectedProduct._id);
      toast.success("Product deleted.");
      deleteDialog.close();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to delete product.");
    }
  };

  return (
    <div className="space-y-8 page-enter">
      <PageHeader
        eyebrow="Admin CRUD"
        title="Manage products"
        description="Create and edit products on dedicated pages with media upload, preview, ordering, and optimistic list updates."
        actions={
          <Button onClick={() => navigate("/admin/products/create")}>
            <Plus className="h-4 w-4" />
            New product
          </Button>
        }
      />
      <Card>
        <CardContent className="p-4">
          <DataTable columns={columns} rows={rows} />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(value) => (value ? deleteDialog.open() : deleteDialog.close())}
        title="Delete product"
        description={`This will permanently remove ${selectedProduct?.name || "this product"}.`}
        onConfirm={handleDelete}
        loading={deleteProduct.isPending}
      />
    </div>
  );
}
