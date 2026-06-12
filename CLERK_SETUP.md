# Clerk Setup For Rovara

This project already contains the Clerk integration code. You only need to add your Clerk app credentials and enable the providers you want.

## 1. Create a local env file

Create `.env.local` in the project root and paste this:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Add your existing app secrets too if they are not already in `.env.local`:

```env
DATABASE_URL=
OPENAI_API_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
OPENWEATHER_API_KEY=
GOOGLE_PLACES_API_KEY=
```

## 2. Where each Clerk key comes from

### `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

Get this from Clerk Dashboard -> **API Keys**.

- It usually starts with `pk_test_` locally or `pk_live_` in production.
- This key is safe for the browser.

### `CLERK_SECRET_KEY`

Get this from Clerk Dashboard -> **API Keys**.

- It usually starts with `sk_test_` locally or `sk_live_` in production.
- Keep this private. Never expose it in client code.

### `CLERK_WEBHOOK_SIGNING_SECRET`

Get this from Clerk Dashboard -> **Webhooks**.

1. Create a webhook endpoint for your Rovara app.
2. Use endpoint URL:
   `http://localhost:3000/api/webhooks/clerk`
3. After the endpoint is created, open its settings.
4. Reveal and copy the Signing Secret.

The secret usually starts with `whsec_`.

## 3. Clerk dashboard settings for this app

Use these route values in Clerk if you configure redirect URLs:

- Sign-in URL: `/sign-in`
- Sign-up URL: `/sign-up`
- After sign-in: `/dashboard`
- After sign-up: `/dashboard`
- After sign-out: `/`

## 4. Enable social login

In Clerk Dashboard -> **Social connections**:

1. Enable **Google**
2. Enable **GitHub**

If Clerk asks for custom OAuth credentials, create them in Google Cloud and GitHub Developer Settings and paste them into Clerk.

## 5. Local webhook note

The webhook route in this project is:

`/api/webhooks/clerk`

For local testing, Clerk needs a public URL. In practice that means using a tunnel such as `ngrok` or another public forwarding tool and then registering:

`https://your-public-url/api/webhooks/clerk`

If you only want sign-in/sign-up working first, webhooks are not required immediately. They are only needed for syncing Clerk users into your Prisma `User` table.

## 6. What routes are protected

This project protects these routes through Clerk middleware:

- `/dashboard`
- `/generate`
- `/trip/*`
- `/saved`
- `/analytics`
- `/profile`
- `/settings`

## 7. What is already wired in code

These parts are already connected:

- `ClerkProvider` in `src/app/layout.tsx`
- proxy-based route protection in `src/proxy.ts`
- premium auth pages at `/sign-in` and `/sign-up`
- server session helpers in `src/lib/auth/server.ts`
- Clerk webhook verification in `src/app/api/webhooks/clerk/route.ts`
- dashboard user menu in `src/components/auth/auth-user-menu.tsx`

## 8. After adding the keys

Restart the dev server so Next.js reloads the environment variables.

Then verify:

1. `/sign-up` renders the Clerk sign-up form
2. `/sign-in` renders the Clerk sign-in form
3. visiting `/dashboard` while signed out redirects you to `/sign-in`
4. signing in redirects you to `/dashboard`

## References

- Clerk `verifyWebhook()` docs: https://clerk.com/docs/reference/backend/verify-webhook
- Clerk middleware docs: https://clerk.com/docs/reference/nextjs/clerk-middleware
- Clerk social connections docs: https://clerk.com/docs/guides/configure/auth-strategies/social-connections/overview
- Clerk webhook syncing guide: https://clerk.com/docs/guides/development/webhooks/syncing
