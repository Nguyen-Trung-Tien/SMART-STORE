import * as React from "react"
import { RadioGroup as RadioGroupPrimitive, Radio as RadioPrimitive } from "@base-ui/react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  if (!RadioGroupPrimitive) {
    console.error("RadioGroupPrimitive is undefined");
    return <div className={className}>{props.children}</div>;
  }
  return (
    <RadioGroupPrimitive
      ref={ref}
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  if (!RadioPrimitive || !RadioPrimitive.Root) {
    console.error("RadioPrimitive.Root is undefined");
    return <div className={className} />;
  }
  return (
    <RadioPrimitive.Root
      ref={ref}
      className={cn(
        "aspect-square size-4 shrink-0 rounded-full border border-input transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex items-center justify-center h-full w-full after:block after:size-1.5 after:rounded-full after:bg-current" />
    </RadioPrimitive.Root>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
