import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PromoBanner() {
  return (
    <motion.section
      id="deals"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[2rem] border border-emerald-200/50 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-900 px-6 py-10 text-white shadow-[0_30px_70px_-40px_rgba(6,78,59,0.75)] md:px-10 md:py-12"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(52,211,153,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.28),transparent_25%)]" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <Badge className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-white backdrop-blur">
            Limited-time event
          </Badge>
          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-[-0.03em] md:text-5xl">Seasonal sale up to 40% off select essentials.</h2>
            <p className="max-w-xl text-base leading-7 text-slate-300">
              Launch-ready promotional real estate for campaigns, drops, and margin-driving events with a bold layout
              that works across every breakpoint.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur md:min-w-[280px]">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Promo code</p>
          <p className="text-3xl font-black tracking-tight">AURA40</p>
          <Button size="lg" className="w-full rounded-full bg-white text-slate-950 hover:bg-white/90">
            Claim Offer
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
