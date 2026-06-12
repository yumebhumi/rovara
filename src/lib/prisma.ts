import { PrismaClient } from "@prisma/client";

declare global {
  var __rovaraPrisma__: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getDatabaseConfigurationErrorMessage() {
  return "Trip saving is not configured for this environment yet. Add a valid DATABASE_URL to continue.";
}

export const prisma = globalThis.__rovaraPrisma__ ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__rovaraPrisma__ = prisma;
}

export const db = prisma;

export type DatabaseClient = PrismaClient;
