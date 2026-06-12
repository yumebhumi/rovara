"use client";

import Link from "next/link";
import { cn } from "@/utils/cn";
import { isProtectedHref } from "@/lib/auth";
import { ActiveIndicator } from "./active-indicator";

type NavLinkProps = {
  href: string;
  label: string;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
};

export function NavLink({ href, label, isActive = false, className, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      prefetch={!isProtectedHref(href)}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-full px-4 py-2.5 text-[0.95rem] font-medium tracking-[-0.01em]",
        "text-[#94A3B8] transition-[color,transform,border-color] duration-300 hover:-translate-y-px hover:text-[#F8FAF8]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/30 focus-visible:ring-offset-0",
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="relative z-10">{label}</span>
      {isActive ? (
        <ActiveIndicator />
      ) : (
        <span className="absolute inset-0 rounded-full border border-transparent transition-colors duration-300 group-hover:border-white/[0.06]" />
      )}
    </Link>
  );
}
