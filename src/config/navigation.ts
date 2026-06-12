import type { LucideIcon } from "lucide-react";
import { Bookmark, Sparkles, UserRound } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export type AppNavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string;
};

export type DashboardNavigationItem = AppNavigationItem;

export type DashboardNavigationGroup = {
  title: string;
  items: AppNavigationItem[];
};

export type NavbarNavigationItem = Pick<AppNavigationItem, "label" | "href" | "exact">;

export const primaryNav: NavbarNavigationItem[] = [
  { label: "Generate", href: ROUTES.GENERATE },
  { label: "Trips", href: ROUTES.TRIPS }
];

export const profileNavItem: NavbarNavigationItem = {
  label: "Profile",
  href: ROUTES.PROFILE
};

export const userMenuNav: AppNavigationItem[] = [
  { label: "Profile", href: ROUTES.PROFILE, icon: UserRound },
  { label: "Saved Trips", href: ROUTES.TRIPS, icon: Bookmark }
];

export const mainNav = primaryNav;

export const mobileNav: AppNavigationItem[] = [
  { label: "Generate", href: ROUTES.GENERATE, icon: Sparkles },
  { label: "Trips", href: ROUTES.TRIPS, icon: Bookmark },
  { label: "Profile", href: ROUTES.PROFILE, icon: UserRound }
];

export const dashboardNavigation: DashboardNavigationGroup[] = [
  {
    title: "Planning",
    items: mobileNav
  }
];
