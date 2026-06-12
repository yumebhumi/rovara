import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AUTH_ROUTE_PATTERNS, PROTECTED_ROUTE_PATTERNS, clerkRouting } from "@/lib/auth";

const isProtectedRoute = createRouteMatcher([...PROTECTED_ROUTE_PATTERNS]);
const isAuthRoute = createRouteMatcher([...AUTH_ROUTE_PATTERNS]);
const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

const proxyHandler = clerkEnabled
  ? clerkMiddleware(async (auth, req) => {
      if (isAuthRoute(req)) {
        const { userId } = await auth();

        if (userId) {
          return NextResponse.redirect(new URL(clerkRouting.signInFallbackRedirectUrl, req.url));
        }
      }

      if (isProtectedRoute(req)) await auth.protect();
    })
  : () => NextResponse.next();

export default proxyHandler;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)"
  ]
};
