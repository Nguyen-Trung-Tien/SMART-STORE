import { useParams } from "react-router-dom";
import { useProductDetails } from "@/features/products/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Star, 
  ShoppingCart, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Minus,
  Plus
} from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: productData, isLoading } = useProductDetails(id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const product = productData?.data;

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      amount: quantity,
      discount: product.discount,
    };
    addToCart(cartItem, user?._id);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-10 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Không tìm thấy sản phẩm</h2>
        <Button asChild className="mt-4">
          <Link to="/products">Quay lại cửa hàng</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl border bg-white shadow-sm">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-contain p-8"
          />
          {product.discount > 0 && (
            <Badge className="absolute left-6 top-6 bg-destructive text-destructive-foreground px-3 py-1.5 text-lg font-bold">
              -{product.discount}%
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Badge variant="secondary" className="w-fit capitalize px-3 py-1">
              {product.type}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-muted border-muted"}`} 
                  />
                ))}
                <span className="ml-2 font-medium">{product.rating} / 5</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span className="text-muted-foreground">Đã bán 150+</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-primary">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price * (1 - product.discount/100))}
              </span>
              {product.discount > 0 && (
                <span className="text-xl text-muted-foreground line-through decoration-destructive/30">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Giá đã bao gồm thuế VAT</p>
          </div>

          <div className="flex flex-col gap-6 border-y py-8">
            <div className="flex flex-col gap-3">
              <span className="font-bold">Số lượng</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border bg-muted/30 p-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10" 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10" 
                    onClick={() => setQuantity(q => Math.min(product.countInStock, q + 1))}
                    disabled={quantity >= product.countInStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">{product.countInStock} sản phẩm có sẵn</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="h-14 flex-1 gap-2 text-lg font-bold" onClick={handleAddToCart} disabled={product.countInStock === 0}>
                <ShoppingCart className="h-5 w-5" /> Thêm vào giỏ
              </Button>
              <Button size="lg" variant="outline" className="h-14 flex-1 border-primary text-primary hover:bg-primary/5 text-lg font-bold" asChild disabled={product.countInStock === 0}>
                <Link to="/checkout">Mua ngay</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border p-4 bg-card">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Bảo hành 24 tháng</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border p-4 bg-card">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Miễn phí vận chuyển</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border p-4 bg-card">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <RotateCcw className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Đổi trả 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="mt-20">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
            <TabsTrigger 
              value="description" 
              className="rounded-none border-b-2 border-transparent px-8 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent font-bold"
            >
              Mô tả sản phẩm
            </TabsTrigger>
            <TabsTrigger 
              value="specifications" 
              className="rounded-none border-b-2 border-transparent px-8 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent font-bold"
            >
              Thông số kỹ thuật
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none border-b-2 border-transparent px-8 py-4 data-[state=active]:border-primary data-[state=active]:bg-transparent font-bold"
            >
              Đánh giá (12)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-10">
            <div className="prose prose-blue max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-10">
            <div className="max-w-2xl overflow-hidden rounded-xl border">
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b bg-muted/30">
                    <th className="px-6 py-4 font-semibold">Thương hiệu</th>
                    <td className="px-6 py-4 capitalize">{product.type}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="px-6 py-4 font-semibold">Model</th>
                    <td className="px-6 py-4">Smart {product.name.split(' ').pop()}</td>
                  </tr>
                  <tr className="border-b bg-muted/30">
                    <th className="px-6 py-4 font-semibold">Bảo hành</th>
                    <td className="px-6 py-4">24 tháng</td>
                  </tr>
                  <tr className="border-b">
                    <th className="px-6 py-4 font-semibold">Tình trạng</th>
                    <td className="px-6 py-4">Mới 100% fullbox</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-10">
            <div className="flex flex-col items-center justify-center py-10 text-center border rounded-2xl bg-muted/10">
               <p className="text-muted-foreground italic">Tính năng đánh giá đang được cập nhật...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
