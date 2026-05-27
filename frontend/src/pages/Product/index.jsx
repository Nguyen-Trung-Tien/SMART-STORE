import { useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { ProductCard } from "@/features/product/components/ProductCard";
import { ProductCardSkeleton } from "@/components/skeleton/ProductCardSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { useProducts } from "@/features/product/hooks/useProducts";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 350);

  const query = useProducts({
    limit: 8,
    page: page - 1,
    filter: debouncedSearch ? ["name", debouncedSearch] : undefined,
  });

  const items = query.data?.items || [];
  const totalPages = Math.max(1, Math.ceil((query.data?.total || items.length || 1) / 8));

  return (
    <div className="space-y-8 page-enter">
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Search, paginate, and cache server data without duplicating it in Redux."
      />
      <div className="surface flex items-center gap-3 p-3">
        <Search className="ml-3 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="border-0 shadow-none focus-visible:ring-0"
          placeholder="Search products by name"
        />
      </div>
      {query.isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : items.length ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState title="No products found" description="Try a different search term." />
      )}
    </div>
  );
}
