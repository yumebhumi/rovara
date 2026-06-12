import * as React from "react";
import { cn } from "@/utils/cn";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("block text-sm font-medium text-[#CBD5E1] light:text-[#475569]", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";
