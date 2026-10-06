# SDC Website — Project State
**Last Updated:** 2026-10-06

## Project Overview
- **Project Name:** SDC Website
- **Organization:** Student Development Council (SDC), IISER Bhopal
- **Current Website:** https://sdc-website-ten-umber.vercel.app/
- **Project Role:** User is the tech lead of SDC; AI acts as developer/architect.
- **Status:** Architecture and MVP approved. Phase 5 (Supabase schema + Google Auth) implemented; awaiting credentials to activate.

## Current Objective
- Build an SDC digital platform: a public website plus an authenticated student platform, delivered as one coherent product.
- Implement incrementally in approved milestones. Do not build unapproved features.

## Approved Decisions
- **Tech stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS. Supabase provides Postgres database, Google Auth, Storage, and Row-Level Security. Deploy on Vercel.
- **2026-09-17 stack confirmation:** evaluated pivoting to PostgreSQL (Neon) + Prisma + Auth.js; **decision: keep Supabase**. Existing docs/plan unchanged.
- **Authentication:** Google Sign-In only, restricted to `@iiserb.ac.in` hosted domain. No other sign-in methods in release 1.
- **Roles:** `Student`, `Admin`, `Super Admin`. Admins seeded from an approved email list; access method to be confirmed.
- **Release 1 (MVP + CotM):**
  - Public website (Home, About, Initiatives, Events, Career of the Month, Resources, Announcements, Contact)
  - Google Sign-In + student accounts
  - Events + event registration (open/closed/capacity/deadline)
  - Career of the Month v1
  - Basic admin content management
- **Deferred (design with framework hooks, do not build yet):** attendance verification, certificates, notifications, search, analytics.
- **Design language:** institutional, clean, mobile-first; neutral slate-based palette + one accent; reuse existing SDC hero visual and team assets; minimal decoration.
- **Content strategy:** SDC members manage dynamic content (events, resources, announcements, CotM tracks) through the admin interface, not by editing code.

## Career of the Month (v1) — Approved Definition
- A **track** = a career/domain with: title, tagline, intro, "why it matters", timeline entries, linked events, categorized resources, status (draft/planned/active/completed).
- Students **enroll** in a track from its page.
- **Progress** computed from DB-configurable rules (not hardcoded):
  - v1 rule: track events registered for ÷ total track events. Weightings stored on the track so future rules (e.g., attendance-based) can replace them without schema changes.
- **Completion:** reached when progress meets a per-track threshold (stored on track). Certificates and attendance gating are NOT built yet but the pipeline stays open.

## Requirements Checklist
| Requirement | Status | Notes |
|---|---|---|
| Understand complete website vision | Done | Full brief received. |
| Maintain living project record | In progress | This file. |
| Requirements checklist | In progress | Tracked here. |
| Review current website | Done | Existing Next.js single-page landing reviewed; assets retained. |
| Decide technical architecture | Approved | Next.js + Supabase + Vercel (confirmed 2026-09-17). |
| Authentication model | Done | Google, `@iiserb.ac.in` only; verified live with `samyak25@iiserb.ac.in`. |
| Sitemap | Approved | See below. |
| Define database schema | Done | Migration `supabase/migrations/0001_init.sql` written; RLS + triggers; applied to project `xwriyhblbltqkrconvyi`. |
| Design direction | Approved (base) | Palette/typography final pass during design phase. |
| Build public pages | Done | Phase 4 complete. All approved public routes live; lint clean; production build green. |
| Supabase schema migration | Done | Applied + verified (13 tables); seed super admin row present. |
| Google Sign-In + session + logout | Done | Verified live: OAuth → `/auth/callback` → session → navbar signed in; sign-out works. |
| Role enforcement (admin gate) | Done | Role-based redirect in `proxy.ts`; role auto-assigned from `admin_emails` (super_admin confirmed on first sign-in). |
| Authentication implementation | Done | End-to-end verified against live project. |
| Events + registration | Code complete; deployed | Phase 6. Seed migration applied live (8 events + `count_active_registrations` RPC verified via REST); repo lint+build green. Awaiting interactive register→dashboard→cancel browser test. |
| CotM v1 | Not started | Phase 7. |
| Admin interface | Not started | Phase 8. |
| Attendance framework | Deferred | Schema-ready only. |
| Certificates | Deferred | Schema-ready only. |

## Sitemap (Approved)
- **Public:** `/` Home, `/about`, `/initiatives`, `/events` (+ `/events/[slug]`, incl. the Announcements section at `/events#announcements`), `/cotm` + `/cotm/[slug]`, `/resources`, `/contact`, `/login`. (`/announcements` is no longer a page — 308-redirects to `/events#announcements`.)
- **Student (auth):** `/dashboard`, `/dashboard/events`, `/dashboard/progress`, `/dashboard/profile`.
- **Admin (auth + role):** `/admin` (events, cotm, resources, announcements, users, settings).

## Database Entities (conceptual)
users, roles (via role column on users), events, registrations, attendance (schema-ready, unused), tracks, track_events, track_resources, track_enrollments, progress, resources, announcements, certificates (schema-ready, unused).

## Proposed Build Order (Phases)
1. Scaffold Next.js 15 + Tailwind + Supabase client; folder structure; design tokens.
2. Public pages (Home, About, Initiatives, Events list/detail, CotM list/detail, Resources, Announcements, Contact).
3. Supabase schema migration; seed admin users; static data via DB where dynamic.
4. Google Auth (`@iiserb.ac.in`), session handling, login/logout, role enforcement.
5. Events + registration flows + student dashboard (My Events, My Progress).
6. CotM v1: tracks, enrollment, progress computation, track pages.
7. Admin area: content management for events/resources/announcements/CotM/users.
8. Responsive/accessibility/security pass; error/empty/loading states.
9. Deployment config (Vercel, env vars, callback URLs) + documentation.

## Pending Decisions (needed before their respective phase)
- Admin seeding: decided — `samyak25@iiserb.ac.in` = `super_admin` (`0002_seed_admin_emails.sql`); more emails can be added later.
- Final palette/typography choice.
- Event registration defaults: capacity numbers, cancellation allowed? (defaults agreed — cancellable until deadline, optional capacity; to be reviewed when building the registration UI)
- CotM: initial track topic/date for first run.
- Supabase project + Google OAuth credentials (URL/anon key/redirect URIs).

## Development Rules
- Follow the user's latest instructions as source of truth.
- No major design/feature/technical decisions without approval; explain rationale, trade-offs, and alternatives.
- Work in small, reviewable milestones; test each feature before moving on.
- Do not claim incomplete work is complete.
- Do not commit secrets or `.env`. Provide `.gitignore`.
- Keep public pages SEO-friendly; keep authenticated pages unindexed.
- Accessibility and security considered from the start.

## Current Blocker
- None for Phase 6 planning. Minor housekeeping: the service-role secret key (`SB_SECRET_…`) was shared in plaintext chat — consider rotating it once convenient. Google OAuth redirect-URI was fixed live (client `1375…bt` now includes the Supabase callback).

## Current Progress
- Full brief understood; existing site reviewed; architecture, auth, sitemap, release scope, and CotM v1 approved.
- Phase 4 (public website) complete: scaffolded Next.js 16 + Tailwind, built the design system and components, and shipped all approved public pages (Home, About, Initiatives, Events + detail, CotM + track, Resources, Announcements, Contact, Login shell, 404). Reused legacy brand assets and content. `npm run lint` and `npm run build` pass.
- Phase 5 (schema + auth) implemented:
  - Installed `@supabase/supabase-js` + `@supabase/ssr`.
  - `src/lib/supabase/{server,client,middleware,actions}.ts` + `src/lib/auth.ts` (`getCurrentSession`).
  - `src/proxy.ts` (Next 16 proxy = old middleware) — session refresh, `/dashboard`+`/admin` protection, role gate, login redirect-if-signed-in.
  - Migration `supabase/migrations/20260917000000_init.sql` — all entities, RLS everywhere, `@iiserb.ac.in` signup trigger, profile-sync trigger, role assignment from `admin_emails`. Attendance/certificates are schema-only hooks.
  - `/login` wired to real Google sign-in (`hd=iiserb.ac.in`) with loading/error states; `/auth/callback` code exchange; sign-out server action in navbar (desktop + mobile).
  - Env guards so the site builds/renders without credentials; `.env.example` added.
  - `npm run lint` clean; `npm run build` green (public pages static, `/login`+`/auth/callback` dynamic).
- Next Phase 5 verification: live end-to-end confirmed — Google OAuth (`hd=iiserb.ac.in`), callback code exchange, session cookie, navbar signed-in state, sign-out. `samyak25@iiserb.ac.in` created as `super_admin`. `npm run lint` + `npm run build` green.
- Team page (interim, before Phase 6): extracted the full team dataset from the legacy site export (26 members: Faculty Advisor, Student Advisor, Secretary, Vice Secretaries, Core Committee, Trainee Team) — names, roles, quotes, LinkedIn, IISERB emails. Optimized the legacy team photos (30.6 MB → 1.9 MB, ≤640px) into `public/images/team/`. Added `TeamMember`/`TeamGroup` types, `src/lib/content/team.ts`, `TeamCard` component, `/team` page (linked from navbar + About). Lint clean, build green, `/team` renders.
- Phase 6 (dashboard + events + registration) — code complete, committed on `main`; DB-side steps still pending (see Current Blocker):
  - `supabase/migrations/20260917000200_seed_events.sql` — seeds the 8-event catalog (used to be static) + `count_active_registrations()` RPC (security definer). **Not yet applied to the live project.**
  - `src/lib/events-repo.ts` — DB-backed event reads (`listEvents`, `getEvent`, `getEventRow`, `getSeatsFilled`, `getMyRegistration`) with static-seed fallback when Supabase is unconfigured/empty.
  - `src/lib/events/actions.ts` — `registerForEvent` / `cancelRegistration` Server Actions: enforce sign-in, `registration_open`, deadline, capacity, duplicate check; `revalidatePath` on success.
  - `src/components/events/register-panel.tsx` — client panel (register vs. registered/cancel, seat counts, inline messages) via `useActionState`.
  - Converted `/events` + `/events/[slug]` to DB source; detail page now shows seats filled and is interactive for signed-in students.
  - `/dashboard` (new `(dashboard)` route group, protected by proxy): welcome, My Events (upcoming + history), available-to-register suggestions.
  - Post-login redirect now goes to `/dashboard` (login page, callback route default, proxy `/login` redirect).
  - Navbar: signed-in users get a Dashboard link (desktop + mobile).
  - Also fixed: navbar links were off-centre (grid 3-col layout) and partial team rows (e.g. Vice Secretaries) now centre (flex-wrap justify-center). Committed as its own fix commit.
  - Lint clean; production build green (incl. `/dashboard` route); dev smoke test: `/events` 200 (fallback seed), `/dashboard` 307 → `/login` without session, event detail renders.
- Next Phase 6 step: apply `20260917000200_seed_events.sql` to the live Supabase project, then log in and E2E-test register → dashboard → cancel against real data.
- Phase 6 status check (2026-09-18): node_modules restored (transient npm network error, no proxy issue). `npm run lint` clean; `npm run build` green (all 14 routes + Proxy). Seed migration confirmed applied live — REST query lists all 8 events; `count_active_registrations` RPC callable (returned 0). `/events` + `/events/[slug]` render from DB (detail shows "Registration open"/seat state). Remaining: interactive browser test — sign in as `samyak25@iiserb.ac.in`, register → check `/dashboard` → cancel.
- Next: interactive Phase 6 E2E (register → dashboard → cancel), then Phase 7 (CotM v1) planning.
- Content/UX edit batch (2026-10-06), per user's live-site review:
  - **E-Cell link:** `Initiative.href` field added; the entrepreneurship card on Home and the `/initiatives` article now link to https://ecell-iiser-bhopal.vercel.app/ (opens in a new tab).
  - **Events cleared:** static seed emptied (`src/lib/content/events.ts`) *and* live DB wiped via `supabase/migrations/20261006000000_clear_events.sql` (8 seeded events deleted; 3 registrations cascade-deleted — all FKs to events are `on delete cascade`). `/events` now shows the announcements section + a "registration closed" empty state; no bare section headings for empty lists.
  - **Resources cleared:** all 7 placeholder cards removed (none linked anywhere real); `/resources` shows one honest empty state instead of filter/search UI over nothing; the home Resources section is hidden while the list is empty. `resources.ts` comment says: only add a resource once there is something real to open.
  - **Filler removed:** home sections (Events/Resources/Announcements) render only when they have content; CoTM home section's fake "Track progress 35%" bar deleted; track detail page's empty "Events coming soon"/"No resources yet" sections hidden; "0 events" counts dropped from CoTM home section and track cards.
  - **Team page:** single-member groups (Faculty Advisor, Student Advisor, Secretary) were rendering ~133px-wide cards — the `li` kept `sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]` inside a `max-w-md` ul, so 1/3 of 448px. Now `w-full` in a wider `max-w-lg` ul, so names/roles/quotes no longer wrap. Title/description now state the **2025–26 tenure**.
  - **Announcements folded into Events:** `/announcements` page deleted; it's now a section on `/events` (`id="announcements"`, pinned-first). Navbar + footer links removed; home "View all announcements" points at `/events#announcements`; `next.config.ts` adds a permanent 308 redirect so old links keep working.
  - **Mobile dashboard:** signed-in users on small screens now get an icon-only avatar Dashboard button in the top bar **and** a Dashboard button at the top of the mobile menu (previously both were desktop-only, so mobile users had no way in).
  - Verified: `npm run lint` clean, `npm run build` green (stale `.next` had to be cleared after deleting the route), local prod-server checks passed — 308 redirect, announcements section present, no empty headings, team `<li class="w-full">` in `max-w-lg`, E-Cell anchor live.