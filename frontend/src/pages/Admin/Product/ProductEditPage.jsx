import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ProductForm } from "@/features/admin/components/ProductForm";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { useProductById } from "@/hooks/api/useProduct";
import { useUpdateProduct } from "@/hooks/api/useCreateProduct";

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const productQuery = useProductById(id);
  const updateProduct = useUpdateProduct({
    onSuccess: () => {
      navigate("/admin/products");
    },
  });

  if (productQuery.isLoading) {
    return <LoadingScreen message="Loading product..." />;
  }

  if (productQuery.isError || !productQuery.product) {
    return (
      <div className="space-y-4">
        <PageHeader eyebrow="Admin" title="Edit product" description="We couldn't load this product." />
        <p className="text-sm text-destructive">
          {productQuery.error?.message || "Failed to load product."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 page-enter">
      <PageHeader
        eyebrow="Admin"
        title={`Edit ${productQuery.product.name}`}
        description="Update product details, reorder the gallery, and replace media without leaving the page."
      />

      <Card>
        <CardContent className="p-6">
          <ProductForm
            initialValues={productQuery.product}
            onSubmit={(values) => updateProduct.mutateAsync({ id, payload: values })}
            isSubmitting={updateProduct.isPending}
            submitLabel="Update product"
          />
          {updateProduct.isError ? (
            <p className="mt-4 text-sm text-destructive">
              {updateProduct.error?.message || "Failed to update product."}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
