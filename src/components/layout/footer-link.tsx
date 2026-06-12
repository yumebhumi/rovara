"use client";

import Link from "next/link";
import { cn } from "@/utils/cn";
import { isProtectedHref } from "@/lib/auth";

type FooterLinkProps = {
  href: string;
  label: string;
  external?: boolean;
  className?: string;
};

export function FooterLink({ href, label, external = false, className }: FooterLinkProps) {
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <li>
      <Link
        href={href}
        prefetch={!external && !isProtectedHref(href)}
        {...linkProps}
        className={cn(
          "group relative inline-flex items-center gap-1.5 rounded text-sm text-[#94A3B8]",
          "transition-colors duration-200 hover:text-[#F8FAF8]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/35",
          className
        )}
      >
        <span className="relative">
          {label}
          <span
            aria-hidden="true"
            className="absolute -bottom-px left-0 h-px w-0 rounded-full bg-[#14B8A6] transition-[width] duration-200 group-hover:w-full"
          />
        </span>
      </Link>
    </li>
  );
}
