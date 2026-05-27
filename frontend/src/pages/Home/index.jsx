import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductCard } from "@/features/product/components/ProductCard";
import { ProductCardSkeleton } from "@/components/skeleton/ProductCardSkeleton";
import { useProducts } from "@/features/product/hooks/useProducts";

export default function HomePage() {
  const productsQuery = useProducts({ limit: 4, page: 0 });

  return (
    <div className="space-y-12 page-enter">
      <section className="surface overflow-hidden p-8 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <PageHeader
              eyebrow="Commerce platform"
              title="A frontend architecture built to scale with product, operations, and admin workflows."
              description="This codebase combines React Query, Redux Toolkit, shadcn/ui, and guarded routing in a maintainable enterprise structure."
            />
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/products">
                  Explore catalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/admin/dashboard">View admin demo</Link>
              </Button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] bg-slate-950 p-8 text-white"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["JWT auth", "Refresh token rotation with request replay"],
                ["Server state", "Caching, invalidation, optimistic updates"],
                ["Client state", "Auth, cart, UI, and local persistence"],
                ["UX polish", "Dark mode, skeletons, errors, toasts, motion"],
              ].map(([title, text]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="font-bold">{title}</p>
                  <p className="mt-2 text-sm text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="space-y-6">
        <PageHeader
          eyebrow="Featured products"
          title="Backend-connected catalog cards"
          description="This section is driven by the real `/api/product/get-all` endpoint through TanStack React Query."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {productsQuery.isLoading
            ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
            : (productsQuery.data?.items || []).map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>
    </div>
  );
}
