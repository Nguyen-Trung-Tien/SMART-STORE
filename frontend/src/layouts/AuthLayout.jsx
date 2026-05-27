import { Outlet } from "react-router-dom";
import { Logo } from "@/components/common/Logo";

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-hero-grid bg-grid">
      <div className="container flex min-h-screen items-center justify-center py-12">
        <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="hidden flex-col justify-between rounded-[2rem] bg-slate-950 p-10 text-white lg:flex">
            <Logo />
            <div className="space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-300">Enterprise commerce</p>
              <h1 className="text-5xl font-extrabold leading-tight">A resilient storefront foundation for fast-moving product teams.</h1>
              <p className="max-w-lg text-slate-300">
                Built for secure auth, composable features, responsive flows, and backend-aligned data contracts.
              </p>
            </div>
          </div>
          <div className="surface mx-auto w-full max-w-xl p-6 md:p-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
