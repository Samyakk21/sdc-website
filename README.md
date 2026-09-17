# Student Development Council — Website

Public website plus authenticated student platform for the Student Development Council (SDC) at IISER Bhopal.

- Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Auth/DB: Supabase (Postgres + Google Auth + Storage + RLS)
- Sign-in: Google OAuth restricted to `@iiserb.ac.in`
- Deploy: Vercel

## Getting started

Node 22 LTS via nvm:

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve a production build |
| `npm run lint` | ESLint |

## Project structure

```
src/
  app/(marketing)/     Public routes (Home, About, Initiatives, Events, CotM, Resources, Announcements, Contact, Login)
  app/auth/            OAuth callback route handler
  components/          Layout, UI primitives, and feature components
  lib/content/         Seed/static content (mirrors future DB entities)
  lib/supabase/        Server/browser clients, session refresh, sign-out action
  lib/auth.ts          Session + profile helper, role checks
  lib/                 Types, formatters, event-status helpers
  proxy.ts             Next.js 16 proxy: session refresh + route protection
supabase/migrations/   Versioned SQL (schema, RLS, triggers)
legacy/                The previous single-page site (HTML export + assets)
```

Static seed data in `src/lib/content/` stands in for database rows at this stage. In later phases it is
replaced by Supabase-backed queries while the public pages remain the same.

## Environment variables

Copy `.env.example` to `.env.local` and fill in values from your Supabase project
(Project Settings → API):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe for browsers) |
| `NEXT_PUBLIC_SITE_URL` | Public origin (local: `http://localhost:3000`) |

Without these the public website still builds and renders; authenticated routes
simply report no session, and the auth flows activate once credentials are set.

## Supabase setup

1. Create a Supabase project and add Google as an OAuth provider
   (Authentication → Providers). Authorized redirect URIs must include:
   - `http://localhost:3000/auth/callback` (local dev)
   - `https://<your-domain>/auth/callback` (production)
2. Apply the schema migration. With the Supabase CLI:
   ```bash
   supabase link --project-ref <ref>
   supabase db push
   ```
   or paste `supabase/migrations/*.sql` into the Supabase SQL editor.
3. Seed admin accounts by inserting approved IISERB email addresses into
   `admin_emails` (see the seed migration / SQL editor).
4. Restart `npm run dev`.

### Sign-in policy

- Only `@iiserb.ac.in` Google accounts may sign in. The browser passes
  `hd=iiserb.ac.in` to Google's account picker, and a `auth.users` trigger
  rejects any other domain (defense in depth).
- Roles: `student`, `admin`, `super_admin`. Roles are assigned automatically at
  account creation based on the `admin_emails` allowlist.

## Where auth/schema code lives

- `src/lib/supabase/` — server/browser clients, session-refresh logic
  (`middleware.ts`), sign-out server action
- `src/lib/auth.ts` — `getCurrentSession()` session/profile helper + role checks
- `src/proxy.ts` — Next.js 16 proxy (was `middleware`); refreshes sessions and
  guards `/dashboard` and `/admin`
- `supabase/migrations/` — versioned SQL (schema, RLS policies, triggers)

## Roadmap / decisions

See `STATE_updated.md` for the living project record, approved decisions, and build phases.
Do not build features outside the approved roadmap.