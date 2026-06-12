"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { isProtectedHref } from "@/lib/auth";

type HeroCtaProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "glass";
  className?: string;
};

export function HeroCta({ href, children, variant = "primary", className }: HeroCtaProps) {
  return (
    <motion.div
      className="w-full sm:w-auto"
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Link
        href={href}
        prefetch={!isProtectedHref(href)}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold tracking-[0.01em] sm:w-auto",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/35",
          variant === "primary"
            ? "border border-[#14B8A6]/28 bg-[#14B8A6] text-[#041311] shadow-[0_10px_22px_rgba(20,184,166,0.1)] transition-colors duration-200 hover:bg-[#1ac7b4]"
            : "border border-white/[0.08] bg-white/[0.03] text-[#F8FAF8] backdrop-blur-lg transition-colors duration-200 hover:bg-white/[0.06]",
          className
        )}
      >
        {children}
      </Link>
    </motion.div>
  );
}
