export const ROUTES = {
  HOME: "/",
  GENERATE: "/generate",
  TRIPS: "/trips",
  TRIP: (id: string) => `/trip/${id}`,
  PROFILE: "/profile",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  DASHBOARD: "/dashboard",
  EXPLORE: "/explore",
  SAVED: "/saved",
  ANALYTICS: "/analytics",
  SETTINGS: "/settings",
  PRICING: "/pricing"
} as const;
