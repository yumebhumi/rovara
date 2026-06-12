"use client";

import { SignOutButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import type { SessionUser } from "@/lib/auth";
import { clerkRouting } from "@/lib/auth";
import { primaryNav, profileNavItem } from "@/config/navigation";
import { panelTransition } from "@/styles/animations";
import { cn } from "@/utils/cn";
import { AuthButtons } from "./auth-buttons";
import { MobileNavItem } from "./mobile-nav-item";
import { isActivePath } from "./nav-links";

type MobileMenuProps = {
  open: boolean;
  pathname: string;
  user: SessionUser | null;
  clerkEnabled: boolean;
  onNavigate?: () => void;
};

export function MobileMenu({
  open,
  pathname,
  user,
  clerkEnabled,
  onNavigate
}: MobileMenuProps) {
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          id="mobile-nav"
          role="navigation"
          aria-label="Mobile primary navigation"
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={panelTransition}
          className="max-h-[calc(100dvh-6.5rem)] overflow-y-auto border-t border-white/[0.08]"
        >
          <div className="space-y-2 px-3 pb-3 pt-4">
            {primaryNav.map((item) => (
              <MobileNavItem
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={isActivePath(pathname, item.href, item.exact)}
                onClick={onNavigate}
              />
            ))}

            {user ? (
              <>
                <MobileNavItem
                  href={profileNavItem.href}
                  label={profileNavItem.label}
                  isActive={isActivePath(pathname, profileNavItem.href, profileNavItem.exact)}
                  onClick={onNavigate}
                />

                {clerkEnabled ? (
                  <SignOutButton redirectUrl={clerkRouting.afterSignOutUrl}>
                    <button
                      type="button"
                      onClick={onNavigate}
                      className={cn(
                        "flex min-h-12 w-full items-center justify-center rounded-[1.15rem] border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-[#F8FAF8]",
                        "transition-[background-color,border-color,transform] duration-300 hover:-translate-y-px hover:bg-white/[0.05]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE3CF]/30"
                      )}
                    >
                      Logout
                    </button>
                  </SignOutButton>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex min-h-12 w-full items-center justify-center rounded-[1.15rem] border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-[#64748B]"
                  >
                    Enable Clerk to logout
                  </button>
                )}
              </>
            ) : (
              <div className="pt-1">
                <AuthButtons clerkEnabled={clerkEnabled} mobile onNavigate={onNavigate} />
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
