import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductCardSkeleton } from "@/components/skeleton/ProductCardSkeleton";
import { ProductCard } from "@/features/product/components/ProductCard";
import { useWishlist } from "@/hooks/api/useWishlist";
import { useNavigate } from "react-router-dom";

export default function WishlistPage() {
  const navigate = useNavigate();
  const wishlistQuery = useWishlist();
  const wishlist = wishlistQuery.wishlist;

  return (
    <div className="space-y-8 page-enter">
      <PageHeader
        eyebrow="My Account"
        title="My Wishlist"
        description="View and manage the products you have saved to your wishlist."
      />

      {wishlistQuery.isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {wishlistQuery.isError ? (
        <ErrorState
          title="Unable to load wishlist"
          description={wishlistQuery.error?.message || "Please try again in a moment."}
          onRetry={wishlistQuery.refetch}
        />
      ) : null}

      {!wishlistQuery.isLoading && !wishlistQuery.isError && !wishlist.length ? (
        <EmptyState
          title="Your wishlist is empty"
          description="You haven't saved any items to your wishlist yet."
          actionLabel="Explore products"
          onAction={() => navigate("/products")}
        />
      ) : null}

      {!wishlistQuery.isLoading && !wishlistQuery.isError && wishlist.length ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              You have {wishlist.length} item{wishlist.length === 1 ? "" : "s"} in your wishlist
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
