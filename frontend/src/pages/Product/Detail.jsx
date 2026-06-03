import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  ImageIcon,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Heart,
  X,
} from "lucide-react";
import { useWishlist, useToggleWishlist } from "@/hooks/api/useWishlist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { LoadingScreen } from "@/components/feedback/LoadingScreen";
import { ErrorState } from "@/components/common/ErrorState";
import { extractIdFromSlug } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/formatter";
import { useProductById } from "@/hooks/api/useProduct";
import { useProductReviews, useCreateReview } from "@/hooks/api/useReviews";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "@/components/ui/sonner";
import { uploadApi } from "@/api/upload.api";

function buildProductImages(product) {
  const allImages = [
    product?.thumbnail?.url
      ? {
          url: product.thumbnail.url,
          alt: product.thumbnail.alt || product.name,
          width: product.thumbnail.width,
          height: product.thumbnail.height,
          isPrimary: true,
        }
      : null,
    ...(Array.isArray(product?.images) ? product.images : []),
    product?.image
      ? {
          url: product.image,
          alt: product.name,
          isPrimary: true,
        }
      : null,
  ].filter(Boolean);

  const uniqueImages = [];
  const seen = new Set();

  allImages.forEach((image, index) => {
    const key = image.url || `image-${index}`;
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    uniqueImages.push({
      ...image,
      alt: image.alt || `${product?.name || "Product"} image ${uniqueImages.length + 1}`,
    });
  });

  return uniqueImages;
}

function renderStars(rating, sizeClassName = "h-4 w-4") {
  return Array.from({ length: 5 }, (_, index) => {
    const filled = index < Math.round(Number(rating) || 0);

    return (
      <Star
        key={`star-${index}`}
        className={`${sizeClassName} ${filled ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
      />
    );
  });
}

function ProductImageModal({ images, activeIndex, open, onOpenChange, onSelect }) {
  const activeImage = images[activeIndex] || images[0];

  if (!activeImage) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-hidden border-white/10 bg-slate-950 p-0 text-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Product image preview</DialogTitle>
          <DialogDescription>Preview product media at full size.</DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[92vh] gap-0 lg:grid-cols-[minmax(0,1fr),160px]">
          <div className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.14),_transparent_32%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(2,6,23,1))] p-6 sm:p-10">
            <img
              src={activeImage.url}
              alt={activeImage.alt}
              className="max-h-[72vh] w-auto max-w-full rounded-[2rem] object-contain shadow-2xl"
            />

            {images.length > 1 ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => onSelect((activeIndex - 1 + images.length) % images.length)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 text-white hover:bg-white/20"
                  onClick={() => onSelect((activeIndex + 1) % images.length)}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            ) : null}
          </div>

          <div className="flex gap-3 overflow-x-auto border-t border-white/10 bg-slate-900/80 p-4 lg:flex-col lg:overflow-y-auto lg:border-l lg:border-t-0">
            {images.map((image, index) => (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() => onSelect(index)}
                className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border transition ${
                  index === activeIndex ? "border-white shadow-[0_0_0_1px_rgba(255,255,255,0.35)]" : "border-white/10 opacity-70"
                }`}
              >
                <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const productId = extractIdFromSlug(slug);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useWishlist({ enabled: isAuthenticated });
  const toggleWishlistMutation = useToggleWishlist();
  const productQuery = useProductById(productId);
  const reviewsQuery = useProductReviews(productId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSource, setPreviewSource] = useState("gallery");
  const [previewImages, setPreviewImages] = useState([]);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const createReviewMutation = useCreateReview(productId);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const previewUrlsRef = useRef([]);

  useEffect(() => {
    previewUrlsRef.current = previewUrls;
  }, [previewUrls]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (!isReviewModalOpen) {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  }, [isReviewModalOpen]);

  if (productQuery.isLoading) {
    return <LoadingScreen message="Loading product details..." />;
  }

  if (productQuery.isError || !productQuery.product) {
    return (
      <ErrorState
        description={productQuery.error?.message || "Unable to load product."}
        onRetry={productQuery.refetch}
      />
    );
  }

  const product = productQuery.product;
  const galleryImages = buildProductImages(product);
  const isLiked = wishlist.some((item) => item._id === product._id);

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please login to manage your wishlist.");
      navigate("/login");
      return;
    }

    toggleWishlistMutation.mutate(product._id, {
      onSuccess: () => {
        if (isLiked) {
          toast.success(`${product.name} removed from wishlist.`);
        } else {
          toast.success(`${product.name} added to wishlist.`);
        }
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to update wishlist.");
      },
    });
  };
  const activeImage = galleryImages[selectedImageIndex] || galleryImages[0];
  const reviewImages = reviewsQuery.reviews.flatMap((review) =>
    (review.images || []).map((image) => ({
      url: image,
      alt: review.title || `Review from ${review.user?.name || "customer"}`,
    }))
  );
  const stockCount = Number(product.countInStock) || 0;
  const canAddToCart = stockCount > 0;
  const maxQuantity = Math.max(Math.min(stockCount || 1, 10), 1);
  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : Number(product.discount) || 0;
  const savings = product.compareAtPrice > product.price ? product.compareAtPrice - product.price : 0;
  const shortDescription = product.shortDescription || product.description;

  const openPreview = (images, index = 0, source = "gallery") => {
    setPreviewSource(source);
    setPreviewImages(images);
    setPreviewImageIndex(index);
    setIsPreviewOpen(true);
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity,
      })
    );
    toast.success(`${product.name} added to cart.`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars.");
      return;
    }
    if (comment.trim().length < 3) {
      toast.error("Review comment must be at least 3 characters.");
      return;
    }

    try {
      let imageUrls = [];
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });

        const uploadRes = await uploadApi.uploadMultipleFiles(formData);
        if (uploadRes?.status === "ERR") {
          throw new Error(uploadRes?.message || "Failed to upload images");
        }
        
        imageUrls = uploadRes?.data?.map((img) => img.url) || [];
      }

      createReviewMutation.mutate(
        {
          product: productId,
          rating,
          comment,
          images: imageUrls,
        },
        {
          onSuccess: (res) => {
            setIsUploading(false);
            if (res?.status === "ERR") {
              toast.error(res?.message || "Failed to submit review");
              return;
            }
            toast.success("Review submitted successfully!");
            setIsReviewModalOpen(false);
            setRating(5);
            setComment("");
          },
          onError: (err) => {
            setIsUploading(false);
            toast.error(err?.message || "An error occurred while submitting review.");
          },
        }
      );
    } catch (err) {
      setIsUploading(false);
      toast.error(err?.message || "Failed to upload images.");
    }
  };

  return (
    <div className="page-enter space-y-8 pb-10">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr),minmax(360px,0.9fr)]">
        <div className="space-y-4">
          <Card className="overflow-hidden border-white/60 bg-white/80">
            <CardContent className="p-3 sm:p-4">
              <div className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_30%),linear-gradient(180deg,_rgba(248,250,252,1),_rgba(241,245,249,0.92))]">
                <button
                  type="button"
                  className="group relative block aspect-[4/4.4] w-full overflow-hidden rounded-[1.6rem]"
                  onClick={() => openPreview(galleryImages, selectedImageIndex, "gallery")}
                  onMouseMove={(event) => {
                    const bounds = event.currentTarget.getBoundingClientRect();
                    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
                    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
                    setZoomOrigin(`${x}% ${y}%`);
                    setIsZoomActive(true);
                  }}
                  onMouseLeave={() => {
                    setZoomOrigin("50% 50%");
                    setIsZoomActive(false);
                  }}
                >
                  <img
                    src={activeImage?.url}
                    alt={activeImage?.alt || product.name}
                    className="h-full w-full object-cover transition duration-300"
                    style={{
                      transform: isZoomActive ? "scale(1.7)" : "scale(1)",
                      transformOrigin: zoomOrigin,
                    }}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/40 via-slate-950/5 to-transparent p-4 text-white">
                    <div className="rounded-full bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] backdrop-blur">
                      Hover to zoom
                    </div>
                    <div className="rounded-full bg-white/15 p-2 backdrop-blur">
                      <Expand className="h-4 w-4" />
                    </div>
                  </div>
                </button>

                {discountPercent > 0 ? (
                  <div className="absolute left-5 top-5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft">
                    Save {discountPercent}%
                  </div>
                ) : null}

                {!canAddToCart ? (
                  <div className="absolute right-5 top-5 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-soft">
                    Sold out
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {galleryImages.length ? (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`group overflow-hidden rounded-[1.4rem] border bg-white p-1.5 shadow-sm transition ${
                    index === selectedImageIndex
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border/70 hover:border-primary/40"
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-slate-100">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                </button>
              ))}
            </div>
          ) : null}

          {reviewImages.length ? (
            <Card className="overflow-hidden">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Customer photos
                    </p>
                    <h2 className="text-xl font-bold">Seen in real life</h2>
                  </div>
                  <Badge variant="secondary">{reviewImages.length} uploads</Badge>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {reviewImages.slice(0, 8).map((image, index) => (
                    <button
                      key={`${image.url}-${index}`}
                      type="button"
                      onClick={() => {
                        const matchingIndex = galleryImages.findIndex((item) => item.url === image.url);
                        if (matchingIndex >= 0) {
                          setSelectedImageIndex(matchingIndex);
                          openPreview(galleryImages, matchingIndex, "gallery");
                          return;
                        }
                        openPreview(reviewImages, index, "review");
                      }}
                      className="overflow-hidden rounded-[1.2rem]"
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="aspect-square h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <Card className="overflow-hidden border-white/60 bg-white/80">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>{product.type}</Badge>
                {product.brand ? <Badge variant="secondary">{product.brand}</Badge> : null}
                {product.isFeatured ? (
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured
                  </Badge>
                ) : null}
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">{product.name}</h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{shortDescription}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">{renderStars(product.rating, "h-5 w-5")}</div>
                <p className="font-semibold text-slate-900">{Number(product.rating || 0).toFixed(1)}</p>
                <span className="text-muted-foreground">
                  {product.numReviews || reviewsQuery.reviews.length} reviews
                </span>
              </div>

              <div className="rounded-[1.8rem] border border-primary/10 bg-[linear-gradient(135deg,rgba(255,247,237,1),rgba(255,255,255,0.95))] p-5">
                <div className="flex flex-wrap items-end gap-3">
                  <p className="text-4xl font-black tracking-tight text-slate-950">
                    {formatCurrency(product.price)}
                  </p>
                  {product.compareAtPrice > product.price ? (
                    <p className="pb-1 text-lg text-muted-foreground line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </p>
                  ) : null}
                </div>
                {savings > 0 ? (
                  <p className="mt-2 text-sm font-semibold text-emerald-700">
                    You save {formatCurrency(savings)} on this order
                  </p>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.4rem] border bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Stock</p>
                  <p className="mt-2 text-lg font-bold text-slate-950">
                    {canAddToCart ? `${stockCount} available` : "Currently unavailable"}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Shipping</p>
                  <p className="mt-2 text-lg font-bold text-slate-950">Fast dispatch</p>
                </div>
                <div className="rounded-[1.4rem] border bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Returns</p>
                  <p className="mt-2 text-lg font-bold text-slate-950">30-day window</p>
                </div>
              </div>

              <div className="space-y-4 rounded-[1.8rem] border bg-slate-950 p-5 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-white/60">Purchase</p>
                    <p className="text-xl font-bold">Choose your quantity</p>
                  </div>
                  <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="rounded-full text-white hover:bg-white/10 hover:text-white"
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-14 text-center text-lg font-bold">{quantity}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="rounded-full text-white hover:bg-white/10 hover:text-white"
                      onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
                      disabled={quantity >= maxQuantity || !canAddToCart}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1fr,auto,auto]">
                  <Button size="lg" className="h-14 text-base" disabled={!canAddToCart} onClick={handleAddToCart}>
                    <ShoppingCart className="h-5 w-5" />
                    {canAddToCart ? "Add to cart" : "Out of stock"}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="h-14 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    onClick={handleToggleWishlist}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isLiked ? "fill-red-500 text-red-500" : "text-white/75 hover:text-white"
                      }`}
                    />
                    <span className="sr-only">Wishlist</span>
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    className="h-14 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    onClick={() => openPreview(galleryImages, selectedImageIndex, "gallery")}
                  >
                    Preview
                  </Button>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4 text-sm text-white/80">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  Secure checkout, straightforward returns, and image-backed customer reviews to help you buy with confidence.
                </div>
              </div>

              {Array.isArray(product.tags) && product.tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/70 bg-background px-3 py-1 text-sm text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="grid gap-4 p-5 text-sm text-muted-foreground sm:grid-cols-3">
              <div>
                <p className="font-semibold uppercase tracking-[0.22em] text-slate-900">Primary image</p>
                <p className="mt-2">{galleryImages.length} media assets included</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.22em] text-slate-900">Catalog status</p>
                <p className="mt-2 capitalize">{product.status || "active"}</p>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.22em] text-slate-900">Need more?</p>
                <Link to="/products" className="mt-2 inline-flex font-semibold text-primary hover:underline">
                  Continue browsing
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1.2fr),360px] lg:p-8">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Product details
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">What makes it worth it</h2>
            </div>
            <p className="text-base leading-8 text-muted-foreground">{product.description || shortDescription}</p>
          </div>

          <div className="grid gap-3">
            {[
              canAddToCart ? "In stock and ready to ship" : "Notify-worthy item with limited availability",
              "Responsive gallery with zoom and full-screen preview",
              "Customer reviews include uploaded photos",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[1.4rem] border bg-background/70 p-4">
                <div className="rounded-full bg-emerald-100 p-1 text-emerald-700">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="space-y-6 p-6 lg:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">Reviews</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">What customers are saying</h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">{renderStars(product.rating, "h-5 w-5")}</div>
                <div>
                  <p className="font-bold text-slate-950">{Number(product.rating || 0).toFixed(1)} out of 5</p>
                  <p className="text-sm text-muted-foreground">
                    {product.numReviews || reviewsQuery.reviews.length} verified impressions
                  </p>
                </div>
              </div>
              {isAuthenticated && (
                <Button onClick={() => setIsReviewModalOpen(true)}>Write a Review</Button>
              )}
            </div>
          </div>

          {reviewsQuery.isLoading ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={`review-skeleton-${index}`} className="space-y-4 rounded-[1.8rem] border p-5">
                  <div className="h-5 w-32 rounded-full bg-muted" />
                  <div className="h-4 w-full rounded-full bg-muted" />
                  <div className="h-4 w-4/5 rounded-full bg-muted" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square rounded-2xl bg-muted" />
                    <div className="aspect-square rounded-2xl bg-muted" />
                    <div className="aspect-square rounded-2xl bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!reviewsQuery.isLoading && reviewsQuery.isError ? (
            <ErrorState
              title="Unable to load reviews"
              description={reviewsQuery.error?.message || "Please try again in a moment."}
              onRetry={reviewsQuery.refetch}
            />
          ) : null}

          {!reviewsQuery.isLoading && !reviewsQuery.isError && !reviewsQuery.reviews.length ? (
            <div className="rounded-[2rem] border border-dashed bg-background/70 p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-950">No reviews yet</h3>
              <p className="mt-2 text-muted-foreground">
                This product is ready for its first customer story. Check back once orders start landing.
              </p>
            </div>
          ) : null}

          {!reviewsQuery.isLoading && !reviewsQuery.isError && reviewsQuery.reviews.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {reviewsQuery.reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-[1.8rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,250,252,0.94))] p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {review.user?.avatar ? (
                        <img
                          src={review.user.avatar}
                          alt={review.user?.name || "Reviewer"}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                          {(review.user?.name || "U").slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-950">{review.user?.name || "Anonymous customer"}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1">{renderStars(review.rating)}</div>
                      {review.isVerifiedPurchase ? (
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          Verified purchase
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {review.title ? <h3 className="mt-5 text-lg font-bold text-slate-950">{review.title}</h3> : null}
                  <p className="mt-3 leading-7 text-slate-700">{review.comment}</p>

                  {Array.isArray(review.images) && review.images.length ? (
                    <div className="mt-5 grid grid-cols-3 gap-3">
                      {review.images.map((image, index) => (
                        <button
                          key={`${review._id}-image-${index}`}
                          type="button"
                          onClick={() => {
                            const matchIndex = galleryImages.findIndex((item) => item.url === image);
                            if (matchIndex >= 0) {
                              setSelectedImageIndex(matchIndex);
                              openPreview(galleryImages, matchIndex, "gallery");
                              return;
                            }
                            openPreview(
                              review.images.map((reviewImage, reviewImageIndex) => ({
                                url: reviewImage,
                                alt: `Review from ${review.user?.name || "customer"} ${reviewImageIndex + 1}`,
                              })),
                              index,
                              "review"
                            );
                          }}
                          className="overflow-hidden rounded-[1.2rem] bg-slate-100"
                        >
                          <img
                            src={image}
                            alt={`Review from ${review.user?.name || "customer"} ${index + 1}`}
                            className="aspect-square h-full w-full object-cover transition duration-300 hover:scale-105"
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <ProductImageModal
        images={previewImages.length ? previewImages : galleryImages}
        activeIndex={previewImages.length ? previewImageIndex : selectedImageIndex}
        open={isPreviewOpen}
        onOpenChange={(open) => {
          setIsPreviewOpen(open);
          if (!open) {
            setPreviewImages([]);
            setPreviewSource("gallery");
          }
        }}
        onSelect={(index) => {
          if (previewSource === "review") {
            setPreviewImageIndex(index);
            return;
          }

          setPreviewImageIndex(index);
          setSelectedImageIndex(index);
        }}
      />

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-md bg-white border border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Write a Review</DialogTitle>
            <DialogDescription>
              Share your thoughts about {product.name} with other customers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Overall Rating</label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => {
                  const starValue = index + 1;
                  const isFilled = hoverRating ? starValue <= hoverRating : starValue <= rating;
                  return (
                    <button
                      key={`review-star-${index}`}
                      type="button"
                      className="transition-transform hover:scale-110 focus:outline-none"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          isFilled ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Your Review</label>
              <textarea
                className="w-full min-h-[120px] rounded-2xl border border-border bg-slate-50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none transition"
                placeholder="Share details of your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 block">Add photos (Optional, max 5)</label>
              <div className="flex flex-wrap gap-3">
                {previewUrls.map((previewUrl, idx) => (
                  <div key={idx} className="relative h-20 w-20 rounded-xl overflow-hidden border border-border bg-slate-100">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition"
                      onClick={() => {
                        URL.revokeObjectURL(previewUrl);
                        setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
                        setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {previewUrls.length < 5 && (
                  <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-slate-50 hover:bg-slate-100 transition">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground font-semibold mt-1">Upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const validFiles = [];
                        
                        for (const file of files) {
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error(`File ${file.name} is larger than 5MB.`);
                            continue;
                          }
                          if (!file.type.startsWith("image/")) {
                            toast.error(`File ${file.name} must be an image.`);
                            continue;
                          }
                          validFiles.push(file);
                        }

                        if (validFiles.length > 0) {
                          const currentCount = previewUrls.length;
                          const allowedCount = Math.max(0, 5 - currentCount);
                          const filesToAdd = validFiles.slice(0, allowedCount);
                          const addedUrls = filesToAdd.map((file) => URL.createObjectURL(file));

                          setSelectedFiles((prev) => [...prev, ...filesToAdd]);
                          setPreviewUrls((prev) => [...prev, ...addedUrls]);
                        }
                        e.target.value = "";
                      }}
                    />
                  </label>
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setRating(5);
                  setComment("");
                }}
                disabled={isUploading || createReviewMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading || createReviewMutation.isPending}>
                {(isUploading || createReviewMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isUploading ? "Uploading images..." : createReviewMutation.isPending ? "Submitting review..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
