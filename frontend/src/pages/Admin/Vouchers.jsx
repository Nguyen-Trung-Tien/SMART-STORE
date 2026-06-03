import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/table/DataTable";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useVouchers, useCreateVoucher, useUpdateVoucher, useDeleteVoucher } from "@/hooks/api/useVoucher";
import { formatCurrency } from "@/lib/formatter";

export default function AdminVouchersPage() {
  const vouchersQuery = useVouchers();
  const createVoucher = useCreateVoucher();
  const updateVoucher = useUpdateVoucher();
  const deleteVoucher = useDeleteVoucher();
  
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const deleteDialog = useDisclosure(false);
  const formDialog = useDisclosure(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: {
      type: "percentage",
      isActive: "true",
    }
  });

  const voucherType = watch("type");

  const rows = vouchersQuery.vouchers || [];
  const columns = useMemo(
    () => [
      { key: "code", header: "Code" },
      { key: "name", header: "Name" },
      { key: "type", header: "Type" },
      { 
        key: "value", 
        header: "Value",
        render: (row) => row.type === "percentage" ? `${row.value}%` : formatCurrency(row.value)
      },
      { 
        key: "usage", 
        header: "Usage",
        render: (row) => `${row.usedCount} / ${row.usageLimit || "∞"}`
      },
      { 
        key: "isActive", 
        header: "Status",
        render: (row) => row.isActive ? "Active" : "Inactive"
      },
      {
        key: "actions",
        header: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSelectedVoucher(row);
                reset({ 
                  ...row, 
                  startDate: new Date(row.startDate).toISOString().slice(0, 16),
                  endDate: new Date(row.endDate).toISOString().slice(0, 16),
                  isActive: row.isActive.toString()
                });
                formDialog.open();
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                setSelectedVoucher(row);
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
      await deleteVoucher.mutateAsync(selectedVoucher._id);
      toast.success("Voucher deleted.");
      deleteDialog.close();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to delete voucher.");
    }
  };

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        isActive: values.isActive === "true"
      };

      if (selectedVoucher) {
        await updateVoucher.mutateAsync({ id: selectedVoucher._id, data: payload });
        toast.success("Voucher updated.");
      } else {
        await createVoucher.mutateAsync(payload);
        toast.success("Voucher created.");
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
        title="Manage Vouchers"
        description="Create, edit, and delete discount vouchers and coupons."
        actions={
          <Button onClick={() => {
            setSelectedVoucher(null);
            reset({ 
              name: "", code: "", type: "percentage", value: "", minOrderValue: 0, 
              maxDiscount: "", usageLimit: "", startDate: "", endDate: "", isActive: "true" 
            });
            formDialog.open();
          }}>
            <Plus className="h-4 w-4" />
            New voucher
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
        title="Delete voucher"
        description={`This will permanently remove ${selectedVoucher?.code || "this voucher"}.`}
        onConfirm={handleDelete}
        loading={deleteVoucher.isPending}
      />

      {formDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{selectedVoucher ? "Edit Voucher" : "New Voucher"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Voucher Name">
                  <Input {...register("name", { required: true })} placeholder="e.g. Summer Sale" />
                </FormField>
                <FormField label="Voucher Code">
                  <Input {...register("code", { required: true })} placeholder="e.g. SUMMER2024" className="uppercase" />
                </FormField>

                <FormField label="Discount Type">
                  <Select value={voucherType} onValueChange={(v) => setValue("type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                
                <FormField label="Discount Value">
                  <Input type="number" {...register("value", { required: true })} placeholder="e.g. 10" />
                </FormField>

                <FormField label="Minimum Order Value">
                  <Input type="number" {...register("minOrderValue")} defaultValue={0} />
                </FormField>
                
                {voucherType === "percentage" && (
                  <FormField label="Max Discount Amount">
                    <Input type="number" {...register("maxDiscount")} placeholder="e.g. 50000" />
                  </FormField>
                )}

                <FormField label="Usage Limit (Overall)">
                  <Input type="number" {...register("usageLimit")} placeholder="Leave empty for unlimited" />
                </FormField>

                <FormField label="Status">
                  <Select value={watch("isActive")} onValueChange={(v) => setValue("isActive", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Start Date">
                  <Input type="datetime-local" {...register("startDate", { required: true })} />
                </FormField>
                
                <FormField label="End Date">
                  <Input type="datetime-local" {...register("endDate", { required: true })} />
                </FormField>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={formDialog.close}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting || createVoucher.isPending || updateVoucher.isPending}>
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
