import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function NewArrivalSection({ items = [] }) {
  return (
    <section id="new-arrivals" className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">New Arrivals</p>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950 dark:text-white md:text-4xl">
            Fresh drops presented like a premium editorial shelf.
          </h2>
        </div>
        <Button variant="outline" className="rounded-full">
          Browse all arrivals
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        {items.map((item, index) => (
          <motion.div key={item.id} variants={itemVariants} className={index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}>
            <Card className="group relative h-full overflow-hidden border-border/60 bg-card/80 p-0">
              <img
                src={item.image}
                alt={item.title}
                className={`w-full object-cover transition duration-700 group-hover:scale-105 ${index === 0 ? "h-[420px]" : "h-[203px]"}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 space-y-3 p-5 text-white">
                <Badge className="rounded-full bg-white/15 px-3 py-1 text-white backdrop-blur">{item.badge}</Badge>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/70">{item.category}</p>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight">{item.title}</h3>
                  </div>
                  <span className="text-lg font-semibold">${item.price}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
