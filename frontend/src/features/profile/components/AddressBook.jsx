import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from "@/hooks/api/useAddress";
import { useAuth } from "@/hooks/useAuth";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";

export function AddressBook() {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const addressQuery = useAddresses(userId);
  const createAddress = useCreateAddress(userId);
  const updateAddress = useUpdateAddress(userId);
  const deleteAddress = useDeleteAddress(userId);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const formDialog = useDisclosure(false);
  const deleteDialog = useDisclosure(false);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const handleOpenForm = (address = null) => {
    setSelectedAddress(address);
    if (address) {
      reset({
        label: address.label,
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        city: address.city,
        country: address.country,
        isDefault: address.isDefault,
      });
    } else {
      reset({
        label: "Home",
        fullName: user?.name || "",
        phone: user?.phone || "",
        addressLine1: "",
        city: "",
        country: "Vietnam",
        isDefault: false,
      });
    }
    formDialog.open();
  };

  const onSubmit = async (values) => {
    try {
      if (selectedAddress) {
        await updateAddress.mutateAsync({ id: selectedAddress._id, data: values });
        toast.success("Address updated.");
      } else {
        await createAddress.mutateAsync(values);
        toast.success("Address added.");
      }
      formDialog.close();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Operation failed.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAddress.mutateAsync(selectedAddress._id);
      toast.success("Address deleted.");
      deleteDialog.close();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to delete address.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Address Book</h2>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addressQuery.addresses?.map((address) => (
          <Card key={address._id} className={address.isDefault ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {address.label}
                {address.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleOpenForm(address)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => { setSelectedAddress(address); deleteDialog.open(); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{address.fullName}</p>
              <p>{address.phone}</p>
              <p>{address.addressLine1}</p>
              <p>{address.city}, {address.country}</p>
            </CardContent>
          </Card>
        ))}
        {addressQuery.addresses?.length === 0 && (
          <div className="col-span-2 text-center py-8 text-muted-foreground border rounded-lg border-dashed">
            No addresses saved yet.
          </div>
        )}
      </div>

      {formDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{selectedAddress ? "Edit Address" : "New Address"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Label (e.g. Home, Office)">
                  <Input {...register("label", { required: true })} />
                </FormField>
                <FormField label="Full Name">
                  <Input {...register("fullName", { required: true })} />
                </FormField>
                <FormField label="Phone">
                  <Input {...register("phone", { required: true })} />
                </FormField>
                <FormField label="City">
                  <Input {...register("city", { required: true })} />
                </FormField>
              </div>
              <FormField label="Address Line 1">
                <Input {...register("addressLine1", { required: true })} />
              </FormField>
              <FormField label="Country">
                <Input {...register("country", { required: true })} />
              </FormField>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="isDefault" {...register("isDefault")} className="rounded border-gray-300" />
                <label htmlFor="isDefault" className="text-sm font-medium leading-none">Set as default address</label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={formDialog.close}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting || createAddress.isPending || updateAddress.isPending}>
                  {isSubmitting ? "Saving..." : "Save Address"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={(value) => (value ? deleteDialog.open() : deleteDialog.close())}
        title="Delete address"
        description="Are you sure you want to delete this address?"
        onConfirm={handleDelete}
        loading={deleteAddress.isPending}
      />
    </div>
  );
}
