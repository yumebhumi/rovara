"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  visual?: ReactNode;
  visualPosition?: "bottom" | "right";
  className?: string;
  iconClassName?: string;
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  visual,
  visualPosition = "bottom",
  className,
  iconClassName
}: FeatureCardProps) {
  const splitLayout = Boolean(visual) && visualPosition === "right";

  return (
    <motion.article
      whileHover={{ y: -1.5 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.03]",
        "p-7 shadow-[0_18px_42px_rgba(0,0,0,0.14)] backdrop-blur-xl sm:p-8",
        "transform-gpu will-change-transform transition-[border-color,background-color,transform] duration-500",
        "hover:border-[#14B8A6]/18 hover:bg-white/[0.04]",
        className
      )}
    >
      <div className={cn("relative z-10 flex h-full", splitLayout ? "gap-6 lg:flex-row lg:items-center" : "flex-col")}>
        <div className={cn("flex h-full flex-col", splitLayout ? "min-w-0 flex-1" : "")}>
          <motion.div
            whileHover={{ y: -1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#14B8A6]/16 bg-[#14B8A6]/10 text-[#D6F5EC] transition-colors duration-300",
              iconClassName
            )}
          >
            <Icon size={19} />
          </motion.div>
          <h3 className="rovara-card-title mt-4">{title}</h3>
          <p className="rovara-body-sm mt-3 max-w-md">{description}</p>
          {visual && !splitLayout ? <div className="mt-8 flex-1">{visual}</div> : null}
        </div>
        {visual && splitLayout ? (
          <div className="hidden w-[31%] shrink-0 items-center justify-end lg:flex">{visual}</div>
        ) : null}
      </div>
    </motion.article>
  );
}
