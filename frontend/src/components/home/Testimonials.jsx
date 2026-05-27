import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function Testimonials({ testimonials = [] }) {
  return (
    <section className="space-y-6">
      <div className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Testimonials</p>
        <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950 dark:text-white md:text-4xl">
          Customers notice the polish when every detail feels intentional.
        </h2>
        <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          Premium visuals matter, but trust is what closes the loop. These cards are designed to give social proof the
          same level of refinement as the product merchandising.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-4 lg:grid-cols-3"
      >
        {testimonials.map((item) => (
          <motion.div key={item.name} variants={itemVariants}>
            <Card className="h-full border-border/60 bg-card/80 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-35px_rgba(15,23,42,0.35)]">
              <div className="flex items-center gap-1 text-yellow-400">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-5 text-base leading-7 text-slate-700 dark:text-slate-200">
                &ldquo;{item.review}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-4">
                <img src={item.avatar} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
