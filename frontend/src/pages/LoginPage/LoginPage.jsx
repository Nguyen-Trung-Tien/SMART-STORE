import { LoginForm } from "@/features/auth/components/LoginForm";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative h-[calc(100vh-72px)] bg-[#FAFAFA] dark:bg-[#050505] flex items-center justify-center p-4 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="flex flex-col items-center gap-6">
           {/* Header / Logo */}
           <div className="flex flex-col items-center gap-2 scale-90">
              <div className="h-10 w-10 rounded-xl bg-white dark:bg-neutral-900 border ring-1 ring-black/5 shadow-xl flex items-center justify-center text-primary">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-30">Smart Store</span>
           </div>

           <div className="w-full bg-white dark:bg-neutral-950 rounded-[2rem] p-8 md:p-10 ring-1 ring-black/5 dark:ring-white/5 shadow-2xl">
              <LoginForm />
           </div>

           <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
              <span className="hover:text-primary transition-colors cursor-pointer">Bảo mật</span>
              <div className="h-0.5 w-0.5 rounded-full bg-current" />
              <span className="hover:text-primary transition-colors cursor-pointer">Chính sách</span>
              <div className="h-0.5 w-0.5 rounded-full bg-current" />
              <span className="hover:text-primary transition-colors cursor-pointer">Trợ giúp</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
