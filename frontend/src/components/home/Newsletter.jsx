import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pb-4"
    >
      <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-white via-slate-50 to-orange-50 p-8 shadow-[0_26px_70px_-40px_rgba(15,23,42,0.35)] dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 md:p-10">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Newsletter</p>
            <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950 dark:text-white md:text-4xl">
              Stay close to new drops, private offers, and curated inspiration.
            </h2>
            <p className="text-sm leading-6 text-muted-foreground md:text-base">
              A polished subscription block that looks at home in premium commerce and supports growth loops without
              feeling intrusive.
            </p>
          </div>

          <form className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="h-12 rounded-full border-white/60 bg-white/90 px-5 dark:border-white/10 dark:bg-white/5"
            />
            <Button size="lg" className="h-12 rounded-full px-7">
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </motion.section>
  );
}
