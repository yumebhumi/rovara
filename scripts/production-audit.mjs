import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const loadedFiles = [".env", ".env.local"].filter((file) =>
  existsSync(resolve(root, file))
);

function parseEnvFile(file) {
  const content = readFileSync(resolve(root, file), "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] == null) {
      process.env[key] = value;
    }
  }
}

for (const file of loadedFiles) {
  parseEnvFile(file);
}

const errors = [];
const warnings = [];

function valueOf(key) {
  return process.env[key]?.trim() ?? "";
}

function requireEnv(key, label = key) {
  if (!valueOf(key)) {
    errors.push(`${label} is missing.`);
  }
}

function warnOptional(key, label = key) {
  if (!valueOf(key)) {
    warnings.push(`${label} is not configured. Related features will use fallback behavior.`);
  }
}

requireEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "Clerk publishable key");
requireEnv("CLERK_SECRET_KEY", "Clerk secret key");
requireEnv("CLERK_WEBHOOK_SIGNING_SECRET", "Clerk webhook signing secret");
requireEnv("DATABASE_URL", "PostgreSQL DATABASE_URL");
requireEnv("OPENAI_API_KEY", "OpenAI API key");
requireEnv("NEXT_PUBLIC_APP_URL", "Public app URL");

const clerkPublishable = valueOf("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
const clerkSecret = valueOf("CLERK_SECRET_KEY");

if (clerkPublishable && !/^pk_(test|live)_/.test(clerkPublishable)) {
  errors.push("Clerk publishable key must start with pk_test_ or pk_live_.");
}

if (clerkSecret && !/^sk_(test|live)_/.test(clerkSecret)) {
  errors.push("Clerk secret key must start with sk_test_ or sk_live_.");
}

if (
  clerkPublishable.startsWith("pk_live_") &&
  clerkSecret &&
  !clerkSecret.startsWith("sk_live_")
) {
  errors.push("Production Clerk publishable key is live, but Clerk secret key is not live.");
}

if (
  clerkPublishable.startsWith("pk_test_") &&
  clerkSecret.startsWith("sk_live_")
) {
  errors.push("Clerk publishable key is test, but Clerk secret key is live.");
}

const databaseUrl = valueOf("DATABASE_URL");

if (databaseUrl && !/^postgres(ql)?:\/\//.test(databaseUrl)) {
  errors.push("DATABASE_URL must be a PostgreSQL connection string.");
}

const openAiKey = valueOf("OPENAI_API_KEY");

if (openAiKey && !openAiKey.startsWith("sk-")) {
  errors.push("OPENAI_API_KEY must look like an OpenAI secret key.");
}

const appUrl = valueOf("NEXT_PUBLIC_APP_URL");

if (appUrl) {
  try {
    const parsedUrl = new URL(appUrl);

    if (process.env.NODE_ENV === "production" && parsedUrl.hostname === "localhost") {
      errors.push("NEXT_PUBLIC_APP_URL cannot be localhost in production.");
    }
  } catch {
    errors.push("NEXT_PUBLIC_APP_URL must be a valid absolute URL.");
  }
}

const maxTokens = Number.parseInt(valueOf("OPENAI_MAX_TOKENS") || "2400", 10);
const timeoutMs = Number.parseInt(valueOf("OPENAI_TIMEOUT_MS") || "30000", 10);

if (!Number.isFinite(maxTokens) || maxTokens < 500) {
  errors.push("OPENAI_MAX_TOKENS must be a number greater than or equal to 500.");
}

if (!Number.isFinite(timeoutMs) || timeoutMs < 5000) {
  errors.push("OPENAI_TIMEOUT_MS must be a number greater than or equal to 5000.");
}

warnOptional("NEXT_PUBLIC_MAPBOX_TOKEN", "Mapbox token");
warnOptional("OPENWEATHER_API_KEY", "OpenWeather API key");
warnOptional("GOOGLE_PLACES_API_KEY", "Google Places API key");

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}

if (errors.length > 0) {
  console.error("Production audit failed:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("Production audit passed.");
