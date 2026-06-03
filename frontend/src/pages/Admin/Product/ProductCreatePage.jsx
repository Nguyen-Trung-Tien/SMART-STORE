import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ProductForm } from "@/features/admin/components/ProductForm";
import { useCreateProduct } from "@/hooks/api/useCreateProduct";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct({
    onSuccess: () => {
      navigate("/admin/products");
    },
  });

  return (
    <div className="space-y-8 page-enter">
      <PageHeader
        eyebrow="Admin"
        title="Create product"
        description="Upload the product media first, then save the product with the Cloudinary URLs returned by the backend."
      />

      <Card>
        <CardContent className="p-6">
          <ProductForm
            onSubmit={(values) => createProduct.mutateAsync(values)}
            isSubmitting={createProduct.isPending}
            submitLabel="Create product"
          />
          {createProduct.isError ? (
            <p className="mt-4 text-sm text-destructive">{createProduct.error?.message || "Failed to create product."}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
