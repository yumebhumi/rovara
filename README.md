# ROVARA — AI Travel Planner

Production-style Next.js app for AI-powered itinerary generation with maps, weather intelligence, budgeting, and shareable trips.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Clerk Authentication
- Prisma + PostgreSQL
- OpenAI, Mapbox, OpenWeather, Google Places
- Framer Motion

## Quick start

1. Copy `.env.example` to `.env.local` and fill all keys.
2. Install dependencies: `npm install`
3. Generate Prisma client: `npm run db:generate`
4. Start dev server: `npm run dev`

## Main routes

- `/` Landing page
- `/dashboard` Dashboard
- `/generate` AI trip generator
- `/trip/[id]` Itinerary page
- `/explore`, `/saved`, `/profile`

## API routes

- `/api/generate`
- `/api/weather`
- `/api/places`
- `/api/trips`
- `/api/share`
- `/api/pdf`
- `/api/chat`
