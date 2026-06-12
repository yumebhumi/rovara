import { cn } from "@/utils/cn";

type BadgeVariant = "default" | "success" | "warning" | "destructive";

const variantMap: Record<BadgeVariant, string> = {
  default: "border-[#14B8A6]/18 bg-[#14B8A6]/10 text-[#D6F5EC] light:text-[#0F1720]",
  success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  destructive: "bg-red-500/20 text-red-300 border-red-500/30"
};

export function Badge({ variant = "default", className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", variantMap[variant], className)}
      {...props}
    />
  );
}
