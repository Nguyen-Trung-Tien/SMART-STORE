import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useProductTypes } from "@/features/products/hooks/useProducts";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  ChevronLeft, 
  ChevronRight,
  FilterX
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get("type") || "";
  const filterParam = searchParams.get("filter") || "";
  
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(0);
  const [view, setView] = useState("grid");
  const limit = 12;

  const { data: productsData, isLoading } = useProducts(debouncedSearch, limit, page, typeParam);
  const { data: typesData } = useProductTypes();

  const products = productsData?.data || [];
  const totalPage = productsData?.totalPage || 0;
  const types = typesData?.data || [];

  const handleTypeChange = (type) => {
    if (type === typeParam) {
      searchParams.delete("type");
    } else {
      searchParams.set("type", type);
    }
    setSearchParams(searchParams);
    setPage(0);
  };

  const clearFilters = () => {
    setSearch("");
    setSearchParams({});
    setPage(0);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-8">
        {/* Header & Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tất cả Sản phẩm</h1>
            <p className="text-muted-foreground mt-1">Tìm thấy {productsData?.total || 0} sản phẩm phùate</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm sản phẩm..." 
                className="pl-10" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Bộ lọc
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                  <SheetDescription>
                    Tùy chỉnh danh sách sản phẩm theo ý muốn của bạn.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider">Danh mục</h3>
                    <div className="flex flex-col gap-3">
                      {types.map((type) => (
                        <div key={type} className="flex items-center gap-2">
                          <Checkbox 
                            id={`type-${type}`} 
                            checked={typeParam === type}
                            onCheckedChange={() => handleTypeChange(type)}
                          />
                          <Label htmlFor={`type-${type}`} className="capitalize cursor-pointer">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button variant="outline" onClick={clearFilters} className="gap-2">
                    <FilterX className="h-4 w-4" /> Xóa bộ lọc
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden border rounded-lg p-1 md:flex">
              <Button 
                variant={view === "grid" ? "secondary" : "ghost"} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setView("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={view === "list" ? "secondary" : "ghost"} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">Không tìm thấy sản phẩm</h2>
            <p className="text-muted-foreground mt-2">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn.</p>
            <Button variant="link" onClick={clearFilters} className="mt-4">Xóa tất cả bộ lọc</Button>
          </div>
        ) : (
          <div className={view === "grid" 
            ? "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" 
            : "flex flex-col gap-4"
          }>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <Skeleton className="aspect-[4/5] w-full rounded-xl" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))
            ) : (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPage > 1 && (
          <div className="flex items-center justify-center gap-2 pt-10">
            <Button 
              variant="outline" 
              size="icon"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: totalPage }).map((_, i) => (
              <Button 
                key={i}
                variant={page === i ? "default" : "outline"}
                className="h-10 w-10"
                onClick={() => setPage(i)}
              >
                {i + 1}
              </Button>
            ))}

            <Button 
              variant="outline" 
              size="icon"
              disabled={page === totalPage - 1}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
