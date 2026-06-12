import { serializeTrip } from "./shared";
import { findTripRecordById } from "./shared";

export async function getTripById(id: string, clerkId: string) {
  const trip = await findTripRecordById(id, clerkId);
  return trip ? serializeTrip(trip) : null;
}
