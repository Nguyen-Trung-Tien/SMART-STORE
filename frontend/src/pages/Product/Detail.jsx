import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { ErrorState } from "@/components/common/ErrorState";
import { extractIdFromSlug } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatter";
import { useProductDetail } from "@/features/product/hooks/useProducts";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "@/components/ui/sonner";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const productId = extractIdFromSlug(slug);
  const dispatch = useDispatch();
  const query = useProductDetail(productId);

  if (query.isLoading) {
    return <LoadingScreen message="Loading product details..." />;
  }

  if (query.isError || !query.data) {
    return <ErrorState description={query.error?.message || "Unable to load product."} onRetry={query.refetch} />;
  }

  const product = query.data;

  return (
    <div className="page-enter">
      <Card className="overflow-hidden">
        <CardContent className="grid gap-8 p-6 lg:grid-cols-2 lg:p-8">
          <img src={product.image} alt={product.name} className="h-full min-h-80 w-full rounded-[2rem] object-cover" />
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge>{product.type}</Badge>
              <h1 className="text-4xl font-extrabold">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            <div className="flex items-end gap-4">
              <p className="text-4xl font-extrabold">{formatCurrency(product.price)}</p>
              <p className="text-muted-foreground">{product.countInStock} items available</p>
            </div>
            <Button
              size="lg"
              onClick={() => {
                dispatch(addToCart(product));
                toast.success(`${product.name} added to cart.`);
              }}
            >
              Add to cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
