<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## SDC Website – Project Commands

- Dev server: `npm run dev`
- Production build: `npm run build`
- Lint: `npm run lint` (ESLint; `react/no-unescaped-entities` is configured to allow apostrophes)
- Node is managed via nvm (Node 22 LTS). Load with: `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"`

## Architecture (approved)

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (Postgres + Google Auth + Storage + RLS) — auth coming in a later phase
- Deploy: Vercel
- Public pages live in `src/app/(marketing)/`; shared UI in `src/components/`; seed content in `src/lib/content/`

## Key conventions

- `params` / `searchParams` are Promises — always `await` them.
- Only `@iiserb.ac.in` Google accounts may sign in (Phase 5).
- Do not build features outside the approved roadmap in `STATE_updated.md`.
