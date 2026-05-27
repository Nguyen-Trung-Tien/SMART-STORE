import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { productSchema } from "@/lib/validators";

export function ProductForm({ initialValues, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues || {
      name: "",
      type: "",
      price: 0,
      countInStock: 0,
      rating: 4,
      image: "",
      description: "",
      discount: 0,
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Product name" error={errors.name?.message} className="md:col-span-2">
        <Input {...register("name")} />
      </FormField>
      <FormField label="Type" error={errors.type?.message}>
        <Input {...register("type")} />
      </FormField>
      <FormField label="Price" error={errors.price?.message}>
        <Input type="number" step="0.01" {...register("price")} />
      </FormField>
      <FormField label="Stock" error={errors.countInStock?.message}>
        <Input type="number" {...register("countInStock")} />
      </FormField>
      <FormField label="Rating" error={errors.rating?.message}>
        <Input type="number" step="0.1" {...register("rating")} />
      </FormField>
      <FormField label="Discount" error={errors.discount?.message}>
        <Input type="number" {...register("discount")} />
      </FormField>
      <FormField label="Image URL" error={errors.image?.message} className="md:col-span-2">
        <Input {...register("image")} />
      </FormField>
      <FormField label="Description" error={errors.description?.message} className="md:col-span-2">
        <textarea
          className="min-h-32 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
          {...register("description")}
        />
      </FormField>
      <div className="md:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save product"}
        </Button>
      </div>
    </form>
  );
}
