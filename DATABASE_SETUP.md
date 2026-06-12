# Prisma + PostgreSQL Setup For Rovara

Rovara now uses a normalized PostgreSQL schema through Prisma with:

- `User`
- `Trip`
- `Itinerary`
- `SavedTrip`
- `Recommendation`
- `Notification`

## Environment

Add `DATABASE_URL` to `.env.local`.

Neon example:

```env
DATABASE_URL=postgres://user:password@ep-xxxx.ap-southeast-1.aws.neon.tech/rovara?sslmode=require
```

Supabase example:

```env
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

## Prisma workflow

Generate the Prisma client:

```bash
npm run db:generate
```

Push schema changes to a development database:

```bash
npm run db:push
```

Create a real migration:

```bash
npm run db:migrate -- --name init-rovara-db
```

## Architecture notes

- `src/lib/db.ts` provides a singleton Prisma client for App Router, route handlers, and server components.
- `src/lib/prisma.ts` re-exports the same client for backward compatibility with existing imports.
- `src/lib/db-utils.ts` contains shared pagination helpers for service-layer queries.
- `src/services/` now includes typed database services for trips, users, recommendations, and notifications.
- `src/types/database.ts` exposes strongly typed Prisma payload shapes for relation-heavy queries.

## Schema design decisions

- `Trip.interests` uses PostgreSQL arrays for simple indexed preference matching.
- `generatedItinerary`, `weatherData`, and `mapLocations` use `Json` to support AI snapshots, cached forecasts, and map payloads without excessive denormalization.
- `Itinerary` stays normalized by trip and day, with a unique `(tripId, day)` constraint.
- `SavedTrip` prevents duplicates with a composite unique key.
- `Recommendation` and `Notification` include metadata JSON hooks for future analytics, real-time payloads, and AI expansion.

## Future-ready areas already accounted for

- collaborative planning
- itinerary versioning snapshots
- weather/map cache refresh timestamps
- social sharing via `shareToken`
- notifications with read state and metadata payloads
- analytics-friendly timestamp and lookup indexes
