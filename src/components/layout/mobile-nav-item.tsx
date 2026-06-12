"use client";

import Link from "next/link";
import { isProtectedHref } from "@/lib/auth";
import { cn } from "@/utils/cn";

type MobileNavItemProps = {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
};

export function MobileNavItem({ href, label, isActive = false, onClick }: MobileNavItemProps) {
  return (
    <Link
      href={href}
      prefetch={!isProtectedHref(href)}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex min-h-12 items-center justify-between rounded-[1.15rem] border px-4 py-3 text-sm font-medium tracking-[-0.01em]",
        "transition-[border-color,background-color,color,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/30",
        isActive
          ? "border-white/[0.08] bg-white/[0.05] text-[#F8FAF8] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          : "border-transparent bg-transparent text-[#94A3B8] hover:-translate-y-px hover:border-white/[0.06] hover:bg-white/[0.03] hover:text-[#F8FAF8]"
      )}
    >
      <span>{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full transition-colors duration-300",
          isActive ? "bg-[#8FE3CF]" : "bg-white/[0.12] group-hover:bg-[#8FE3CF]/70"
        )}
      />
    </Link>
  );
}
