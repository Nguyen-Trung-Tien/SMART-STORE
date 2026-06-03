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
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function FeatureSection({ features = [] }) {
  return (
    <section id="about" className="space-y-6">
      <div className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Why Choose Us</p>
        <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950 dark:text-white md:text-4xl">
          Built on the service promises customers actually remember.
        </h2>
        <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
          The section doubles as a trust layer, giving the homepage stronger conversion support without cluttering the
          interface or diluting the premium feel.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full border-border/60 bg-card/80 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-35px_rgba(15,23,42,0.35)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-950 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
