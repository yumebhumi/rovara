"use client";

import type { NavbarNavigationItem } from "@/config/navigation";
import { cn } from "@/utils/cn";
import { NavLink } from "./nav-link";

export function isActivePath(pathname: string, href: string, exact = false) {
  if (href === "/") return pathname === href;
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavLinksProps = {
  items: NavbarNavigationItem[];
  pathname: string;
  className?: string;
  onNavigate?: () => void;
};

export function NavLinks({ items, pathname, className, onNavigate }: NavLinksProps) {
  return (
    <nav className={cn("flex items-center gap-1.5", className)} aria-label="Primary">
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          isActive={isActivePath(pathname, item.href, item.exact)}
          onClick={onNavigate}
        />
      ))}
    </nav>
  );
}
