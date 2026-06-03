import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function TrendingProducts({ products = [] }) {
  return (
    <section id="products" className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Trending Products</p>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950 dark:text-white md:text-4xl">
            Bestsellers with strong margins and even stronger first impressions.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
          Designed for fast scanning and confident conversion with clear pricing, social proof, and subtle motion that
          keeps attention where it matters.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={cardVariants}>
            <Card className="group h-full overflow-hidden border-border/60 bg-card/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-35px_rgba(15,23,42,0.45)]">
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <Badge className="bg-primary px-3 py-1 text-primary-foreground shadow-sm">{product.discount}</Badge>
                  {product.isNew ? (
                    <Badge className="border border-white/50 bg-white/80 px-3 py-1 text-slate-900 dark:border-white/10 dark:bg-slate-950/80 dark:text-white">
                      New
                    </Badge>
                  ) : null}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-4 rounded-full border-white/70 bg-white/80 opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100 dark:border-white/10 dark:bg-slate-950/80"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <Button className="w-full rounded-full">
                    <ShoppingBag className="h-4 w-4" />
                    Add to cart
                  </Button>
                </div>
              </div>

              <CardContent className="space-y-4 p-5">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{product.category}</p>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">{product.title}</h3>
                    <div className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {product.rating}
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">${product.price}</span>
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                  </div>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400">{product.reviewCount} reviews</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
