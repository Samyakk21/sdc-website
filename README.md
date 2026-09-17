# Student Development Council — Website

Public website plus authenticated student platform for the Student Development Council (SDC) at IISER Bhopal.

- Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Auth/DB: Supabase (Postgres + Google Auth + Storage + RLS) — wiring in a later phase
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
  components/          Layout, UI primitives, and feature components
  lib/content/         Seed/static content (mirrors future DB entities)
  lib/                 Types, formatters, event-status helpers
legacy/                The previous single-page site (HTML export + assets)
```

Static seed data in `src/lib/content/` stands in for database rows at this stage. In later phases it is
replaced by Supabase-backed queries while the public pages remain the same.

## Roadmap / decisions

See `STATE_updated.md` for the living project record, approved decisions, and build phases.
Do not build features outside the approved roadmap.