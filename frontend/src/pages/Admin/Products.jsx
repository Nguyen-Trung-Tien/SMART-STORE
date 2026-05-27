import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/table/DataTable";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { ProductForm } from "@/features/admin/components/ProductForm";
import { useDisclosure } from "@/hooks/useDisclosure";
import { formatCurrency } from "@/lib/formatter";
import { useAdminProductMutations, useProducts } from "@/features/product/hooks/useProducts";

export default function AdminProductsPage() {
  const productsQuery = useProducts({ limit: 20, page: 0 });
  const { createProduct, updateProduct, deleteProduct } = useAdminProductMutations();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const createDialog = useDisclosure(false);
  const editDialog = useDisclosure(false);
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
                setSelectedProduct(row);
                editDialog.open();
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
    [deleteDialog, editDialog]
  );

  const handleCreate = async (values) => {
    try {
      await createProduct.mutateAsync(values);
      toast.success("Product created.");
      createDialog.close();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to create product.");
    }
  };

  const handleUpdate = async (values) => {
    try {
      await updateProduct.mutateAsync({ id: selectedProduct._id, payload: values });
      toast.success("Product updated.");
      editDialog.close();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to update product.");
    }
  };

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
        description="This module shows modal forms, optimistic deletion, and per-domain API isolation."
        actions={
          <Dialog open={createDialog.isOpen} onOpenChange={(value) => (value ? createDialog.open() : createDialog.close())}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                New product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create product</DialogTitle>
              </DialogHeader>
              <ProductForm onSubmit={handleCreate} isSubmitting={createProduct.isPending} />
            </DialogContent>
          </Dialog>
        }
      />
      <Card>
        <CardContent className="p-4">
          <DataTable columns={columns} rows={rows} />
        </CardContent>
      </Card>

      <Dialog open={editDialog.isOpen} onOpenChange={(value) => (value ? editDialog.open() : editDialog.close())}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
          </DialogHeader>
          <ProductForm initialValues={selectedProduct} onSubmit={handleUpdate} isSubmitting={updateProduct.isPending} />
        </DialogContent>
      </Dialog>

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
