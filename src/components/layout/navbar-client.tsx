"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { BrandLogo } from "@/components/brand/brand-logo";
import { primaryNav, profileNavItem } from "@/config/navigation";
import { pageTransition } from "@/styles/animations";
import { cn } from "@/utils/cn";
import { AuthButtons } from "./auth-buttons";
import { MobileMenu } from "./mobile-menu";
import { NavLinks, isActivePath } from "./nav-links";
import { UserDropdown } from "./user-dropdown";

type NavbarClientProps = {
  user: SessionUser | null;
  clerkEnabled: boolean;
  wrapperClassName?: string;
  surfaceClassName?: string;
};

export function NavbarClient({
  user,
  clerkEnabled,
  wrapperClassName,
  surfaceClassName
}: NavbarClientProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <header className={cn("sticky top-0 z-50 w-full max-w-full", wrapperClassName)}>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : pageTransition}
        className={cn(
          "w-full max-w-full rounded-[1.35rem] border border-white/[0.08] bg-[#0F171B]/84 sm:rounded-[1.6rem]",
          "supports-[backdrop-filter]:bg-[#0F171B]/80 backdrop-blur-lg",
          "shadow-[0_18px_48px_rgba(0,0,0,0.24)]",
          surfaceClassName
        )}
      >
        <div className="grid min-h-[4.45rem] min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 sm:min-h-[4.7rem] sm:px-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-4">
          <Link
            href="/"
            className="inline-flex min-w-0 items-center gap-2.5 rounded-full py-2 transition-opacity duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/30 sm:gap-3"
            onClick={() => setOpen(false)}
          >
            <BrandLogo
              variant="mark"
              className="w-9 rounded-[0.9rem] sm:w-10"
              priority
              sizes="40px"
            />
            <span className="truncate text-[0.92rem] font-semibold tracking-[-0.02em] text-[#F8FAF8] sm:text-[0.96rem]">
              Rovara
            </span>
          </Link>

          <NavLinks items={primaryNav} pathname={pathname} className="hidden md:flex" />

          <div className="flex min-w-0 items-center justify-end gap-2">
            <div className="hidden md:flex">
              {user ? (
                <UserDropdown
                  user={user}
                  clerkEnabled={clerkEnabled}
                  isActive={isActivePath(pathname, profileNavItem.href, profileNavItem.exact)}
                />
              ) : (
                <AuthButtons clerkEnabled={clerkEnabled} />
              )}
            </div>

            <button
              type="button"
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#F8FAF8]",
                "transition-[background-color,border-color,transform] duration-300 hover:-translate-y-px hover:bg-white/[0.05]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/30 md:hidden"
              )}
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <div className="md:hidden">
          <MobileMenu
            open={open}
            pathname={pathname}
            user={user}
            clerkEnabled={clerkEnabled}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </motion.div>
    </header>
  );
}
