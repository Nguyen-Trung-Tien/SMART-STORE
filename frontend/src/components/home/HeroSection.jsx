import { ArrowRight, Play, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function HeroSection({ showcaseProducts = [] }) {
  const heroProducts = showcaseProducts.slice(0, 3);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-gradient-to-br from-white via-orange-50 to-emerald-50 px-6 py-10 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/40 md:px-8 md:py-14 lg:px-12 lg:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-orange-400/20 blur-3xl dark:bg-orange-500/20" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/15" />
        <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-sky-300/15 blur-3xl dark:bg-sky-400/10" />
      </div>

      <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr,0.95fr]">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-2xl space-y-7">
          <motion.div variants={itemVariants}>
            <Badge className="rounded-full border border-white/60 bg-white/70 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
              Curated luxury commerce
            </Badge>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-orange-100/70 px-3 py-1 text-sm font-medium text-orange-900 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-100">
              <Sparkles className="h-4 w-4" />
              The new season edit is live
            </div>

            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Designed to feel like your favorite premium brand, not a template.
            </h1>

            <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
              Discover elevated essentials, limited drops, and beautifully merchandised collections with a shopping
              experience built for speed, trust, and delight.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="group h-12 rounded-full px-7 text-sm">
              Shop Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-white/60 bg-white/60 px-7 backdrop-blur hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <Play className="h-4 w-4" />
              Explore Collection
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 pt-3">
            {[
              ["18k+", "Premium customers"],
              ["4.9/5", "Average review score"],
              ["48h", "Fast global dispatch"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.18 }}
          className="relative mx-auto w-full max-w-2xl"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-4 shadow-[0_30px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-white/5"
          >
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent dark:from-white/5" />
            <img
              src={heroProducts[0]?.image}
              alt={heroProducts[0]?.title || "Featured collection"}
              className="h-[420px] w-full rounded-[1.5rem] object-cover"
            />

            <Card className="absolute bottom-5 left-5 max-w-[220px] border-white/60 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Featured pick</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{heroProducts[0]?.title}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{heroProducts[0]?.category}</span>
                <span className="font-semibold text-slate-950 dark:text-white">${heroProducts[0]?.price}</span>
              </div>
            </Card>
          </motion.div>

          {heroProducts.slice(1).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25 + index * 0.1 }}
              className={`absolute hidden rounded-[1.75rem] border border-white/60 bg-white/80 p-3 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-slate-950/70 md:block ${
                index === 0 ? "-left-8 top-8 w-52" : "-right-4 bottom-12 w-56"
              }`}
            >
              <div className="overflow-hidden rounded-[1.25rem]">
                <img src={product.image} alt={product.title} className="h-36 w-full object-cover" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{product.title}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <span className="text-sm font-semibold text-slate-950 dark:text-white">${product.price}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
