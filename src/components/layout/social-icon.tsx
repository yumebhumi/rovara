"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

type SocialIconProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  className?: string;
};

export function SocialIcon({ href, label, icon: Icon, className }: SocialIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "group inline-flex h-9 w-9 items-center justify-center rounded-full",
        "border border-white/[0.08] bg-white/[0.03] text-[#94A3B8]",
        "transition-colors duration-200 hover:border-[#14B8A6]/20 hover:bg-[#14B8A6]/8 hover:text-[#F8FAF8]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/35",
        className
      )}
    >
      <Icon size={16} />
    </a>
  );
}
