import { saveTripRequestSchema } from "@/lib/validations/itinerary-schema";
import type { SaveTripRequest } from "@/types";
import type { UpsertDatabaseUserInput } from "@/services/users";
import {
  buildCreateTripData,
  db,
  serializeTrip,
  tripDetailsInclude
} from "./shared";
import { ensureDatabaseUser } from "../users";

export async function saveTrip(
  user: UpsertDatabaseUserInput,
  input: SaveTripRequest
) {
  const parsed = saveTripRequestSchema.parse(input);
  const userId = await ensureDatabaseUser(user);

  const trip = await db.trip.create({
    data: buildCreateTripData(userId, parsed),
    include: tripDetailsInclude
  });

  return serializeTrip(trip);
}
