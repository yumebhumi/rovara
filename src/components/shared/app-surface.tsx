import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const appSurfaceVariants = cva(
  "relative overflow-hidden rounded-[1.9rem] border transition-colors duration-300 backdrop-blur-xl",
  {
    variants: {
      variant: {
        default:
          "border-white/[0.08] bg-[#10191d]/88 shadow-[0_24px_70px_rgba(0,0,0,0.22)] light:border-[#0F1720]/8 light:bg-white light:shadow-[0_20px_60px_rgba(15,23,32,0.08)]",
        strong:
          "border-white/[0.1] bg-[#0f171b]/96 shadow-[0_30px_90px_rgba(0,0,0,0.28)] light:border-[#0F1720]/8 light:bg-[#fdfefe] light:shadow-[0_24px_70px_rgba(15,23,32,0.1)]",
        soft:
          "border-white/[0.06] bg-white/[0.03] shadow-[0_18px_50px_rgba(0,0,0,0.16)] light:border-[#0F1720]/8 light:bg-white/85 light:shadow-[0_18px_50px_rgba(15,23,32,0.06)]",
        hero:
          "border-white/[0.08] bg-[#10191d]/90 shadow-[0_30px_100px_rgba(0,0,0,0.24)] light:border-[#0F1720]/8 light:bg-white"
      },
      padding: {
        none: "",
        sm: "p-5 sm:p-6",
        md: "p-6 sm:p-7",
        lg: "p-7 sm:p-9"
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "md"
    }
  }
);

export interface AppSurfaceProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appSurfaceVariants> {
  glow?: boolean;
}

export const AppSurface = React.forwardRef<HTMLDivElement, AppSurfaceProps>(
  ({ className, variant, padding, glow = false, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(appSurfaceVariants({ variant, padding }), className)}
      {...props}
    >
      {glow ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(143,227,207,0.45),transparent)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-8 top-8 h-24 w-24 rounded-full bg-[#14B8A6]/8 blur-3xl"
          />
        </>
      ) : null}
      <div className="relative">{children}</div>
    </section>
  )
);

AppSurface.displayName = "AppSurface";
