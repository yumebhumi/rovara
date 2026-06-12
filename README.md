# ROVARA

AI travel planner built with Next.js, Clerk, Prisma, and OpenAI. The app generates multi-day itineraries, shows trip budgets and recommendations, supports saved trips for signed-in users, and includes share/PDF utilities for trip output.

## What It Does

- Generates itineraries from destination, dates, budget, travel style, and interests
- Supports authenticated trip saving with Clerk
- Stores users, trips, itinerary days, activities, recommendations, budgets, and notifications in PostgreSQL via Prisma
- Renders trip detail pages, saved trips, dashboard views, and a draft trip flow
- Integrates Mapbox, OpenWeather, and Google Places for richer travel context
- Exports share tokens and PDF output through API routes

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Clerk authentication
- Prisma + PostgreSQL
- OpenAI API
- Mapbox GL
- Framer Motion
- Zod + React Hook Form

## Main App Areas

- `/` marketing landing page
- `/pricing` pricing page
- `/generate` trip generation flow
- `/trip/draft` draft itinerary preview
- `/trip/[id]` saved trip detail page
- `/dashboard` user dashboard
- `/trips` saved trip listing
- `/saved`, `/explore`, `/analytics`, `/profile`, `/settings`
- `/sign-in` and `/sign-up`

## API Routes

- `POST /api/generate` generate an itinerary from trip inputs
- `POST /api/generate-trip` alternate generation endpoint used by the app flow
- `GET /api/trips` fetch paginated trips for the signed-in user
- `POST /api/trips` save a trip for the signed-in user
- `GET/DELETE /api/trips/[id]` fetch or remove a saved trip
- `POST /api/share` create a share token
- `POST /api/pdf` generate trip PDF output
- `GET /api/places` fetch place suggestions/details
- `POST /api/webhooks/clerk` sync Clerk user events

## Project Structure

```text
src/
  app/           Next.js routes, layouts, API handlers
  components/    UI, forms, itinerary, dashboard, auth, landing sections
  services/      OpenAI, maps, trip persistence, domain services
  lib/           validation, auth helpers, Prisma, currency, trip utilities
  hooks/         client hooks for trip generation and saved trips
  providers/     app-wide React providers
  store/         local client state
prisma/          schema and migrations
public/          brand assets
scripts/         repo utilities such as production audit
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required values:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SIGNING_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_MAX_TOKENS`
- `OPENAI_TIMEOUT_MS`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `OPENWEATHER_API_KEY`
- `GOOGLE_PLACES_API_KEY`

Clerk route defaults already expected by the app:

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/generate`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/generate`

### 3. Generate Prisma client

```bash
npm run db:generate
```

### 4. Apply database schema

For local schema sync:

```bash
npm run db:push
```

For a migration-based workflow:

```bash
npm run db:migrate
```

### 5. Start the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` start the local Next.js dev server
- `npm run build` create a production build
- `npm run start` run the production server
- `npm run lint` run ESLint
- `npm run typecheck` run TypeScript checks
- `npm run audit:production` run the production audit script
- `npm run db:generate` generate the Prisma client
- `npm run db:push` push schema changes to the database
- `npm run db:migrate` create/apply Prisma development migrations

## Database Model Overview

Core Prisma models:

- `User`
- `Trip`
- `ItineraryDay`
- `Activity`
- `BudgetBreakdown`
- `Recommendation`
- `Notification`

Trip records include travel dates, budget, currency, travel vibe, interests, recommendations, activities, and sharing metadata.

## Notes

- `.env`, `.env.local`, `.next`, and `node_modules` are ignored from version control.
- The app expects a PostgreSQL database.
- Signed-in trip operations depend on Clerk user identity being configured correctly.

## License

MIT
