import { useState } from "react";
import { RefreshCcw, Search } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductCardSkeleton } from "@/components/skeleton/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { ProductCard } from "@/features/product/components/ProductCard";
import { useProducts } from "@/hooks/api/useProducts";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE_SIZE = 8;

export default function ProductListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const productsQuery = useProducts({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
  });

  const products = productsQuery.products;
  const totalPages = productsQuery.data?.totalPages || 1;

  return (
    <div className="space-y-8 page-enter">
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="React Query now owns server state here, with clean separation from page to hook to API to Axios."
      />

      <div className="surface flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-3">
          <Search className="ml-1 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            className="border-0 shadow-none focus-visible:ring-0"
            placeholder="Search products by name"
          />
        </div>
        <Button variant="outline" onClick={() => productsQuery.refetch()} disabled={productsQuery.isRefetching}>
          <RefreshCcw className={`h-4 w-4 ${productsQuery.isRefetching ? "animate-spin" : ""}`} />
          {productsQuery.isFetching ? "Refreshing..." : "Refetch"}
        </Button>
      </div>

      {productsQuery.isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {productsQuery.isError ? (
        <ErrorState
          title="Unable to load products"
          description={productsQuery.error?.message || "Please try again in a moment."}
          onRetry={productsQuery.refetch}
        />
      ) : null}

      {!productsQuery.isLoading && !productsQuery.isError && !products.length ? (
        <EmptyState
          title="No products found"
          description="Try a different search or adjust your filters."
          actionLabel="Reset search"
          onAction={() => {
            setSearch("");
            setPage(1);
          }}
        />
      ) : null}

      {!productsQuery.isLoading && !productsQuery.isError && products.length ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {productsQuery.isFetching && !productsQuery.isRefetching ? "Updating cached results..." : `${productsQuery.data?.total || products.length} products`}
            </p>
            {productsQuery.isPending ? <p className="text-sm text-muted-foreground">Loading query...</p> : null}
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : null}
    </div>
  );
}
