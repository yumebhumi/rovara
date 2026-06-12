import { ROUTES } from "@/constants/routes";

export const AUTH_ROUTES = [ROUTES.SIGN_IN, ROUTES.SIGN_UP] as const;

export const PROTECTED_ROUTE_PATTERNS = [
  "/dashboard(.*)",
  "/generate(.*)",
  "/trip(.*)",
  "/trips(.*)",
  "/saved(.*)",
  "/explore(.*)",
  "/analytics(.*)",
  "/profile(.*)",
  "/settings(.*)"
] as const;

export const AUTH_ROUTE_PATTERNS = ["/sign-in(.*)", "/sign-up(.*)"] as const;

export const clerkRouting = {
  signInUrl: ROUTES.SIGN_IN,
  signUpUrl: ROUTES.SIGN_UP,
  signInFallbackRedirectUrl: ROUTES.GENERATE,
  signUpFallbackRedirectUrl: ROUTES.GENERATE,
  afterSignOutUrl: ROUTES.HOME
} as const;

export function isProtectedHref(href: string) {
  return [
    ROUTES.GENERATE,
    ROUTES.TRIPS,
    ROUTES.PROFILE,
  ].some((route) => href === route || href.startsWith(`${route}/`));
}
