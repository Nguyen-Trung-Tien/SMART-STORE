import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function CategorySection({ categories = [] }) {
  return (
    <section id="categories" className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Featured Categories</p>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950 dark:text-white md:text-4xl">
            Explore the collections shaping this season.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
          Every category is curated around premium materials, standout silhouettes, and everyday utility that scales
          from workday to weekend.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {categories.map((category) => (
          <motion.article
            key={category.name}
            variants={cardVariants}
            className="group relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/80 shadow-soft backdrop-blur"
          >
            <div className="overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">{category.itemCount} styles</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">{category.name}</h3>
              </div>
              <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur transition group-hover:bg-white/20">
                Explore
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
