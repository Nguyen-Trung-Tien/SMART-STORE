import { useParams, Link } from "react-router-dom";
import { useProductDetails, useProducts } from "@/features/products/hooks/useProducts";
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
  Plus,
  Heart,
  Share2,
  Check,
  Info,
  ArrowRight,
  Maximize2,
  X,
  CreditCard,
  History
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import { ProductCard } from "@/features/products/components/ProductCard";

const cubicBezier = [0.32, 0.72, 0, 1];

const fadeUpVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: cubicBezier
    }
  }
};

// --- Sub-components ---

function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const allImages = useMemo(() => {
    const images = [product.image];
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        if (img !== product.image) images.push(img);
      });
    }
    return images;
  }, [product.image, product.images]);

  useEffect(() => {
    setSelectedImage(product.image);
  }, [product.image]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 overflow-auto scrollbar-hide no-scrollbar max-h-[450px]">
        {allImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={cn(
              "relative min-w-[60px] w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 ring-1 transition-all duration-300",
              selectedImage === img ? "ring-primary shadow-sm" : "ring-black/5 dark:ring-white/10 opacity-60 hover:opacity-100"
            )}
          >
            <img src={img} alt={`${product.name} ${index}`} className="w-full h-full object-contain p-1" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1">
        <motion.div 
          className="group relative rounded-2xl bg-white dark:bg-neutral-950 ring-1 ring-black/5 dark:ring-white/10 shadow-lg overflow-hidden cursor-zoom-in"
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsModalOpen(true)}
        >
          <div className="relative aspect-square flex items-center justify-center p-4 md:p-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img 
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={selectedImage} 
                className={cn(
                  "h-full w-full object-contain transition-transform duration-500",
                  isZooming ? "scale-150" : "scale-100"
                )}
                style={isZooming ? {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                } : {}}
              />
            </AnimatePresence>

            <div className="absolute top-3 left-3">
              {product.discount > 0 && (
                <Badge className="bg-primary text-[10px] font-bold py-0.5 px-2 rounded-md shadow-sm border-none">
                  -{product.discount}%
                </Badge>
              )}
            </div>

            <div className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
               <Maximize2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl border-none bg-white/95 dark:bg-neutral-950/95 backdrop-blur-2xl p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="sr-only">
             <DialogTitle>Thư viện ảnh</DialogTitle>
          </DialogHeader>
          <div className="relative w-full aspect-square flex items-center justify-center p-4">
             <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-destructive hover:text-white transition-colors z-50"
             >
                <X className="h-4 w-4" />
             </button>
             <img src={selectedImage} alt={product.name} className="max-w-full max-h-full object-contain" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VariantSelector({ variations, onSelect }) {
  const [selections, setSelections] = useState({});

  if (!variations || variations.length === 0) return null;

  const handleSelect = (type, option) => {
    const newSelections = { ...selections, [type]: option };
    setSelections(newSelections);
    onSelect(newSelections);
  };

  return (
    <div className="flex flex-col gap-4">
      {variations.map((v) => (
        <div key={v.type} className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{v.type}</h3>
            {selections[v.type] && (
              <span className="text-[11px] font-medium text-primary">Đã chọn: {selections[v.type]}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {v.options.map((opt) => {
              const isSelected = selections[v.type] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(v.type, opt)}
                  className={cn(
                    "min-w-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all ring-1",
                    isSelected 
                      ? "bg-primary text-primary-foreground ring-primary shadow-sm" 
                      : "bg-background text-muted-foreground ring-border hover:ring-primary/40"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Main Page ---

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { data: productData, isLoading } = useProductDetails(id);
  const { data: allProductsData } = useProducts("", 8);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  const product = productData?.data;

  const relatedProducts = useMemo(() => {
    if (!product || !allProductsData?.data) return [];
    return allProductsData.data.filter(p => p._id !== product._id).slice(0, 4);
  }, [product, allProductsData]);

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      amount: quantity,
      discount: product.discount,
      variants: selectedVariants
    };
    addToCart(cartItem, user?._id);
    toast.success(`Đã thêm vào giỏ hàng`, {
      description: product.name,
      icon: <Check className="h-4 w-4 text-emerald-500" />,
      className: "rounded-xl"
    });
  };

  const finalPrice = product ? product.price * (1 - product.discount / 100) : 0;

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
           <Skeleton className="aspect-square w-full rounded-2xl" />
           <div className="space-y-6">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-lg" />
           </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container max-w-6xl mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4">
        <Info className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-bold mb-2">Sản phẩm không tồn tại</h2>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/products">Về cửa hàng</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-6">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <ChevronRight className="h-2.5 w-2.5" />
          <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
          <ChevronRight className="h-2.5 w-2.5" />
          <span className="text-foreground truncate max-w-[100px]">{product.name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-12 items-start">
          {/* Gallery - 7 cols */}
          <div className="md:col-span-7">
            <ProductGallery product={product} />
          </div>

          {/* Info - 5 cols */}
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUpVariants}
            className="md:col-span-5 flex flex-col gap-6"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                  {product.type}
                </Badge>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-wider",
                  product.countInStock > 0 ? "text-emerald-600" : "text-destructive"
                )}>
                  {product.countInStock > 0 ? `Còn hàng (${product.countInStock})` : "Hết hàng"}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-bold text-foreground">{product.rating}</span>
                </div>
                <div className="w-px h-3 bg-border" />
                <span className="text-muted-foreground">48 đánh giá</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(finalPrice)}
                </span>
                {product.discount > 0 && (
                  <span className="text-lg text-muted-foreground/40 line-through font-medium">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3" /> Bảo hành chính hãng 24 tháng
              </p>
            </div>

            <VariantSelector variations={product.variations} onSelect={setSelectedVariants} />

            <div className="flex flex-col gap-4 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border bg-muted/30 p-1">
                  <Button 
                    variant="ghost" size="icon" className="h-8 w-8"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                  <Button 
                    variant="ghost" size="icon" className="h-8 w-8"
                    onClick={() => setQuantity(q => Math.min(product.countInStock, q + 1))}
                    disabled={quantity >= product.countInStock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                   <Button 
                    variant="outline" size="icon" 
                    className={cn("h-10 w-10 rounded-lg", isLiked && "text-destructive fill-destructive")}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="h-12 font-bold rounded-lg shadow-sm" 
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ
                </Button>
                <Button 
                  variant="secondary" className="h-12 font-bold rounded-lg"
                  asChild disabled={product.countInStock === 0}
                >
                  <Link to="/checkout">Mua ngay</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
               {[
                 { icon: Truck, label: "Giao hàng", val: "Miễn phí" },
                 { icon: RotateCcw, label: "Đổi trả", val: "7 ngày" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 p-3 rounded-xl border bg-muted/10">
                    <item.icon className="h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                       <span className="text-[9px] font-bold text-muted-foreground uppercase">{item.label}</span>
                       <span className="text-[11px] font-medium">{item.val}</span>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>

        {/* Details & Reviews */}
        <div className="mt-16 md:mt-24 border-t pt-10">
          <Tabs defaultValue="description">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-muted/50 p-1 rounded-lg">
                <TabsTrigger value="description" className="text-xs font-bold px-6">Mô tả</TabsTrigger>
                <TabsTrigger value="specs" className="text-xs font-bold px-6">Thông số</TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs font-bold px-6">Đánh giá</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="description" className="max-w-3xl mx-auto space-y-6">
              <p className="text-base text-muted-foreground leading-relaxed">
                {product.description || "Thông tin đang được cập nhật."}
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                 <div className="space-y-2">
                    <h4 className="font-bold">Đặc điểm nổi bật</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                       <li>Thiết kế hiện đại, tinh tế</li>
                       <li>Vật liệu cao cấp, bền bỉ</li>
                       <li>Hiệu năng vượt trội trong tầm giá</li>
                    </ul>
                 </div>
                 <div className="space-y-2">
                    <h4 className="font-bold">Cam kết từ Smart Store</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                       <li>Hàng chính hãng 100%</li>
                       <li>Hỗ trợ kỹ thuật 24/7</li>
                       <li>Bảo mật thông tin khách hàng</li>
                    </ul>
                 </div>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="max-w-2xl mx-auto">
               <div className="rounded-xl border overflow-hidden">
                  {[
                    { l: "Thương hiệu", v: product.type },
                    { l: "Mã sản phẩm", v: "SKU-"+product._id.slice(-6).toUpperCase() },
                    { l: "Chất liệu", v: "Hợp kim cao cấp" },
                    { l: "Kết nối", v: "Không dây / Có dây" },
                    { l: "Bảo hành", v: "24 tháng" }
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between p-4 border-b last:border-0 bg-background hover:bg-muted/20 transition-colors">
                       <span className="text-xs font-bold text-muted-foreground">{s.l}</span>
                       <span className="text-xs font-medium">{s.v}</span>
                    </div>
                  ))}
               </div>
            </TabsContent>

            <TabsContent value="reviews" className="max-w-4xl mx-auto text-center space-y-6">
               <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl font-bold">{product.rating}</span>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-4 w-4", i < product.rating ? "fill-current" : "opacity-20")} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Dựa trên 48 đánh giá thực tế</p>
                  <Button variant="outline" size="sm" className="mt-4 rounded-full font-bold text-[10px] uppercase">Viết đánh giá</Button>
               </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related */}
        <section className="mt-20 space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
             <h2 className="text-xl font-bold tracking-tight">Sản phẩm liên quan</h2>
             <Link to="/products" className="text-[10px] font-bold uppercase hover:text-primary transition-colors">Xem tất cả</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      </div>

      {/* Subtle Mobile Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t p-3 md:hidden flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         <div className="flex flex-col">
            <span className="text-[8px] font-bold text-muted-foreground uppercase">Giá tiền</span>
            <span className="text-lg font-bold text-primary">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(finalPrice)}
            </span>
         </div>
         <Button className="h-10 px-6 font-bold text-xs" onClick={handleAddToCart}>
            Mua ngay
         </Button>
      </div>
      
      <div className="h-16 md:hidden" />
    </div>
  );
}
