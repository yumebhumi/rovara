import * as React from "react";
import { cn } from "@/utils/cn";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full resize-none rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-[#F8FAF8] placeholder:text-[#94A3B8]/80 outline-none transition focus:border-[#14B8A6]/45 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#8FE3CF]/20 light:border-[#0F1720]/8 light:bg-white light:text-[#0F1720] light:placeholder:text-[#64748B]/80",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
