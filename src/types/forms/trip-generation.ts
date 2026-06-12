export const TRIP_GENERATION_TRAVEL_TYPES = [
  "Solo",
  "Couple",
  "Friends",
  "Family",
  "Luxury",
  "Backpacking"
] as const;

export const TRIP_GENERATION_INTERESTS = [
  "Adventure",
  "Food",
  "Nature",
  "Luxury",
  "Nightlife",
  "Shopping",
  "Relaxation",
  "Culture",
  "Photography"
] as const;

export const ACCOMMODATION_PREFERENCES = [
  "Hotels",
  "Hostels",
  "Resorts",
  "Airbnb",
  "Luxury Stays"
] as const;

export const TRANSPORTATION_PREFERENCES = [
  "Flights",
  "Trains",
  "Rental Cars",
  "Public Transport",
  "Walking"
] as const;

export type TripGenerationTravelType = (typeof TRIP_GENERATION_TRAVEL_TYPES)[number];
export type TripGenerationInterest = (typeof TRIP_GENERATION_INTERESTS)[number];
export type AccommodationPreference = (typeof ACCOMMODATION_PREFERENCES)[number];
export type TransportationPreference = (typeof TRANSPORTATION_PREFERENCES)[number];
