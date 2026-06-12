import * as React from "react";
import { cn } from "@/utils/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-[#F8FAF8] placeholder:text-[#94A3B8]/80 outline-none transition focus:border-[#14B8A6]/45 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#8FE3CF]/20 light:border-[#0F1720]/8 light:bg-white light:text-[#0F1720] light:placeholder:text-[#475569]/75",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
