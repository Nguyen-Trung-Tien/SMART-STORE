import { LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="surface flex items-center gap-3 px-6 py-4"
      >
        <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
        <p className="font-medium">{message}</p>
      </motion.div>
    </div>
  );
}
