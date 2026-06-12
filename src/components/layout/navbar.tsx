import { getSessionUser } from "@/lib/auth/server";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const user = await getSessionUser();
  const clerkEnabled = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
  );

  return (
    <NavbarClient
      user={user}
      clerkEnabled={clerkEnabled}
      wrapperClassName="px-4 py-3 sm:px-6 sm:py-5"
      surfaceClassName="mx-auto w-full max-w-7xl"
    />
  );
}
