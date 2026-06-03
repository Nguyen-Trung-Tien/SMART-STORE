import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";

export const Drawer = DrawerPrimitive.Root;
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerPortal = DrawerPrimitive.Portal;
export const DrawerClose = DrawerPrimitive.Close;

export function DrawerContent({ className, children, ...props }) {
  return (
    <DrawerPortal>
      <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/60" />
      <DrawerPrimitive.Content
        className={cn("fixed inset-x-0 bottom-0 z-50 mt-24 rounded-t-[28px] border bg-background p-6 shadow-soft", className)}
        {...props}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted-foreground/20" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}
