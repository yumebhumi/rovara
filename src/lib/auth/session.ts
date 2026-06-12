import { auth, currentUser } from "@clerk/nextjs/server";
import type { SessionUser } from "./types";

type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

const isClerkServerConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

const previewSessionUser: SessionUser = {
  id: "preview-user",
  clerkId: "preview-user",
  email: "preview@rovara.app",
  firstName: "Preview",
  lastName: "Traveler",
  fullName: "Preview Traveler",
  imageUrl: null,
  role: "user"
};

function mapSessionUser(user: ClerkUser): SessionUser {
  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "";
  const role = user.publicMetadata?.role === "admin" ? "admin" : "user";

  return {
    id: user.id,
    clerkId: user.id,
    email,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || email || "Traveler",
    imageUrl: user.imageUrl ?? null,
    role
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  // Keep the workspace usable in local preview environments before Clerk keys are added.
  if (!isClerkServerConfigured) return previewSessionUser;

  const { isAuthenticated } = await auth();

  if (!isAuthenticated) return null;

  const user = await currentUser();
  return user ? mapSessionUser(user) : null;
}

export async function requireSessionUser(): Promise<SessionUser> {
  if (!isClerkServerConfigured) return previewSessionUser;

  const authState = await auth();

  if (!authState.isAuthenticated) {
    return authState.redirectToSignIn();
  }

  const user = await currentUser();

  if (!user) {
    return authState.redirectToSignIn();
  }

  return mapSessionUser(user);
}
