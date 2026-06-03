import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/table/DataTable";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/api/useCategory";

export default function AdminCategoriesPage() {
  const categoriesQuery = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const deleteDialog = useDisclosure(false);
  const formDialog = useDisclosure(false);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const rows = categoriesQuery.categories || [];
  const columns = useMemo(
    () => [
      { key: "name", header: "Name" },
      { key: "slug", header: "Slug" },
      { key: "description", header: "Description" },
      {
        key: "actions",
        header: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSelectedCategory(row);
                reset({ name: row.name, description: row.description || "" });
                formDialog.open();
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                setSelectedCategory(row);
                deleteDialog.open();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [deleteDialog, formDialog, reset]
  );

  const handleDelete = async () => {
    try {
      await deleteCategory.mutateAsync(selectedCategory._id);
      toast.success("Category deleted.");
      deleteDialog.close();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to delete category.");
    }
  };

  const onSubmit = async (values) => {
    try {
      if (selectedCategory) {
        await updateCategory.mutateAsync({ id: selectedCategory._id, data: values });
        toast.success("Category updated.");
      } else {
        await createCategory.mutateAsync(values);
        toast.success("Category created.");
      }
      formDialog.close();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Operation failed.");
    }
  };

  return (
    <div className="space-y-8 page-enter">
      <PageHeader
        eyebrow="Admin CRUD"
        title="Manage Categories"
        description="Create, edit, and delete product categories."
        actions={
          <Button onClick={() => {
            setSelectedCategory(null);
            reset({ name: "", description: "" });
            formDialog.open();
          }}>
            <Plus className="h-4 w-4" />
            New category
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
        title="Delete category"
        description={`This will permanently remove ${selectedCategory?.name || "this category"}.`}
        onConfirm={handleDelete}
        loading={deleteCategory.isPending}
      />

      {/* Basic Modal for Category Form */}
      {formDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{selectedCategory ? "Edit Category" : "New Category"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField label="Category Name">
                <Input {...register("name", { required: true })} placeholder="e.g. Laptops" />
              </FormField>
              <FormField label="Description">
                <Input {...register("description")} placeholder="Optional description" />
              </FormField>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={formDialog.close}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting || createCategory.isPending || updateCategory.isPending}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
