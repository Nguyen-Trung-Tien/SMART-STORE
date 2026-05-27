import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          state: ["@reduxjs/toolkit", "react-redux", "@tanstack/react-query"],
          ui: ["framer-motion", "lucide-react", "sonner", "next-themes"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          radix: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-slot",
            "@radix-ui/react-tabs",
            "vaul",
          ],
        },
      },
    },
  },
});
