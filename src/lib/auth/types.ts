export type SessionRole = "user" | "admin";

export type SessionUser = {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  imageUrl: string | null;
  role: SessionRole;
};
