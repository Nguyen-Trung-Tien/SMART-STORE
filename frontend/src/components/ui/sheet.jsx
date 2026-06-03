import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

const sideClasses = {
  right: "right-0 top-0 h-full w-full border-l sm:max-w-lg",
  left: "left-0 top-0 h-full w-full border-r sm:max-w-lg",
};

export const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm" />
    <DialogPrimitive.Content ref={ref} asChild {...props}>
      <motion.div
        initial={{ opacity: 0, x: side === "right" ? 36 : -36 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: side === "right" ? 36 : -36 }}
        className={cn("fixed z-50 bg-background p-6 shadow-soft", sideClasses[side], className)}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </motion.div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";
