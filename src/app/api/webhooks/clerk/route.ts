import { verifyWebhook } from "@clerk/backend/webhooks";
import { deleteDatabaseUserByClerkId, upsertDatabaseUser } from "@/services/users";

export async function POST(request: Request) {
  if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    return new Response("Webhook secret not configured", { status: 503 });
  }

  try {
    const event = await verifyWebhook(request);

    if ((event.type === "user.created" || event.type === "user.updated") && event.data.id) {
      const email = event.data.email_addresses?.[0]?.email_address;

      if (!email) {
        return new Response("Missing user email", { status: 400 });
      }

      await upsertDatabaseUser({
        clerkId: event.data.id,
        email,
        name: `${event.data.first_name ?? ""} ${event.data.last_name ?? ""}`.trim() || null,
        imageUrl: event.data.image_url || null
      });
    }

    if (event.type === "user.deleted" && event.data.id) {
      await deleteDatabaseUserByClerkId(event.data.id);
    }

    return new Response("OK", { status: 200 });
  } catch {
    return new Response("Webhook verification failed", { status: 400 });
  }
}
