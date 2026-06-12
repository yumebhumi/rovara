import { auth, currentUser } from "@clerk/nextjs/server";

export type AuthenticatedApiUser = {
  clerkId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
};

export async function getAuthenticatedApiUser(): Promise<AuthenticatedApiUser | null> {
  const authState = await auth();

  if (!authState.userId) {
    return null;
  }

  const user = await currentUser();

  if (!user || user.id !== authState.userId) {
    return null;
  }

  return {
    clerkId: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? "",
    name: [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
    imageUrl: user.imageUrl || null
  };
}
