import { db } from "./shared";

export async function deleteTrip(id: string, clerkId: string) {
  const deleted = await db.trip.deleteMany({
    where: {
      id,
      user: { clerkId }
    }
  });

  return {
    deleted: deleted.count > 0,
    count: deleted.count
  };
}
