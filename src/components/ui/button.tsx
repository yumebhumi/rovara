"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-[background-color,border-color,color,box-shadow,opacity] duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/35",
  {
    variants: {
      variant: {
        default: "border border-[#14B8A6]/28 bg-[#14B8A6] text-[#041311] shadow-[0_10px_24px_rgba(20,184,166,0.12)] hover:bg-[#1ac7b4]",
        outline: "border border-white/[0.08] bg-white/[0.03] text-[#F8FAF8] hover:bg-white/[0.06] light:border-[#0F1720]/8 light:bg-white light:text-[#0F1720] light:hover:bg-[#f5fbfa]",
        ghost: "text-[#F8FAF8] hover:bg-white/[0.05] light:text-[#0F1720] light:hover:bg-[#0F1720]/[0.04]",
        destructive: "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-6 text-base"
      }
    },
    defaultVariants: { variant: "default", size: "md" }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);

Button.displayName = "Button";
