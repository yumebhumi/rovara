import { db, getDatabaseConfigurationErrorMessage, isDatabaseConfigured } from "@/lib/prisma";

export type UpsertDatabaseUserInput = {
  clerkId: string;
  email: string;
  name?: string | null;
  imageUrl?: string | null;
};

export async function getUserByClerkId(clerkId: string) {
  return db.user.findUnique({
    where: { clerkId }
  });
}

export async function requireDatabaseUserId(clerkId: string) {
  if (!isDatabaseConfigured()) {
    throw new Error(getDatabaseConfigurationErrorMessage());
  }

  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true }
  });

  if (!user) {
    throw new Error("Authenticated user is missing from the database. Configure Clerk webhooks or create the user record first.");
  }

  return user.id;
}

export async function ensureDatabaseUser(input: UpsertDatabaseUserInput) {
  if (!isDatabaseConfigured()) {
    throw new Error(getDatabaseConfigurationErrorMessage());
  }

  const email = input.email.trim();

  if (!email) {
    throw new Error("Authenticated user is missing an email address.");
  }

  const user = await upsertDatabaseUser({
    clerkId: input.clerkId,
    email,
    name: input.name ?? null,
    imageUrl: input.imageUrl ?? null
  });

  return user.id;
}

export async function upsertDatabaseUser(input: UpsertDatabaseUserInput) {
  const name = input.name?.trim() || null;

  return db.user.upsert({
    where: { clerkId: input.clerkId },
    update: {
      email: input.email,
      name,
      imageUrl: input.imageUrl ?? null
    },
    create: {
      clerkId: input.clerkId,
      email: input.email,
      name,
      imageUrl: input.imageUrl ?? null
    }
  });
}

export async function deleteDatabaseUserByClerkId(clerkId: string) {
  return db.user.deleteMany({
    where: { clerkId }
  });
}
