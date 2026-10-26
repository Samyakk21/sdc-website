# SDC Website — Project State
**Last Updated:** 2026-10-25

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
| Events + registration | Code complete; deployed | Phase 6. Seed migration applied live (8 events + `count_active_registrations` RPC verified via REST); repo lint+build green. |
| Superuser event management | Code complete (Phase 8a) | `/admin/events` list/new/edit/delete with zod validation, slug immutability, hybrid `mode` column, `revalidatePath`. Built on existing `events` RLS admin policies. |
| CotM v1 | Not started | Phase 7. `/cotm` shows a "Coming January 2027" panel; track lists dormant. |
| Admin interface | Code complete (Phase 8a) | `requireAdmin()` guard, admin shell (overview + sub-nav), events CRUD, resources CRUD (DB-backed with `is_published` toggle), Admin navbar link (desktop + mobile), `/admin` and `/dashboard` noindex. |
| Opportunities | On hold | Table + RLS created in migration `20261023000000_admin_foundation.sql`; UI/pages deferred per decision. |
| Attendance framework | Deferred | Schema-ready only. |
| Certificates | Deferred | Schema-ready only. |

## Sitemap (Approved)
- **Public:** `/` Home, `/about`, `/initiatives`, `/events` (+ `/events/[slug]`, incl. the Announcements section at `/events#announcements`), `/cotm` + `/cotm/[slug]`, `/resources`, `/login`. (`/announcements` is no longer a page — 308-redirects to `/events#announcements`; `/contact` is no longer a page — 308-redirects to `/`, with contact living in the footer and the home CTA's mailto/phone line.)
- **Student (auth):** `/dashboard`, `/dashboard/events`, `/dashboard/progress`, `/dashboard/profile`.
- **Admin (auth + role):** `/admin` (overview, events, resources), `/admin/events/*`, `/admin/resources/*` — all noindex. `/admin/opportunities` deferred (opportunities on hold).
- **/opportunities:** on hold — public page + student submissions deferred; table + RLS created in migration `20261023000000_admin_foundation.sql`.

## Database Entities (conceptual)
users, roles (via role column on users), events, registrations, attendance (schema-ready, unused), tracks, track_events, track_resources, track_enrollments, progress, resources, announcements, opportunities (table + RLS created; UI on hold), certificates (schema-ready, unused).

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

## Planned: Superuser event management (events page)
**Status:** plan only — not built (2026-10-06). Do not implement until scheduled (natural slot: Phase 8a, events-only admin CRUD ahead of the full admin interface).
- **Goal:** a signed-in superuser can add events and edit their details from the site itself — no SQL, no code edits. `src/lib/events-repo.ts` already reads `public.events`, so anything saved appears on `/events` and `/events/[slug]` with no extra wiring.
- **Who:** `users.role = super_admin` at first (admins later, after a role review). Enforced twice: route gate in `src/proxy.ts` (next to the existing `/dashboard` + `/admin` checks) **and** RLS write policies in the database.
- **Surface:** `/admin/events` — list (draft / open / closed / past) plus new, edit, delete.
- **Fields:** title, tagline, description, date + start/end time (IST), mode (online | offline | hybrid), location, organizer, capacity, registration deadline, status, optional CoTM track link.
- **Server actions:** `createEvent` / `updateEvent` / `deleteEvent`; server-side validation (required fields, deadline before date, sane times, unique slug); `revalidatePath` for `/events` and the detail page after every write.
- **DB migration:** `INSERT`/`UPDATE`/`DELETE` RLS policies on `public.events` scoped to `role in ('admin','super_admin')` — today reads are public and writes are migration-only. No schema changes needed; `count_active_registrations()` already covers seat counts.
- **Decisions needed before build:**
  - Publish flow: add a `draft` status (hidden from public queries) vs. create straight as `upcoming`/`registration_open`.
  - Validation: hand-rolled vs. adding `zod` (repo has no validation dependency today).
  - Slug policy when a title is edited: keep the original slug vs. regenerate with a redirect.
  - Scope: super_admin only for v1 (recommended) vs. all admins.
- **Out of scope for v1:** CoTM track/resource editing, announcements admin (a content file today), event images/banners, notifications/email.

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
- Content purge + root consolidation (2026-10-06, second batch):
  - **Events page stays empty for now:** announcements section moved to directly under the registration section ("Open now"); all 3 seed announcements cleared, so `/events` renders only the registration empty state today. The announcements section is kept in code and reappears automatically (below registration, pinned-first) the moment notices are added to `src/lib/content/announcements.ts`.
  - **CoTM track list emptied:** no track is running; `tracks.ts` now exports `[]`, so `/cotm` shows only the program explainer — the "Current" and "All tracks" sections render nothing while there are no tracks — and the home CoTM section stays hidden. Next track topic remains a pending decision.
  - **Seed migration cleaned:** `20260917000200_seed_events.sql` now carries only the `count_active_registrations()` RPC; the 8-event catalog it used to insert is dead (`20261006000000_clear_events.sql` wipes it anyway).
  - **Superuser events:** plan added above ("Planned: Superuser event management") — deliberately not built in this batch.
  - **Project root consolidated (confirmed with user):** `~/Documents/Projects/sdc-website` is now the single checkout — demo work stripped, fast-forwarded to `b1855b1`, `.env.local` copied over, session moved here. `~/Documents/Projects/SDC_website` deleted. The COTM demo deliverable was discarded as requested; it is no longer an active work item.
- Compendium section on `/resources` (2026-10-06, third batch): added a dedicated **Compendiums** section above the resource library with the SDC's two living Notion documents — *Internship Compendium* (updated 2nd Oct 2026) and *CSIR Internship Compendium* — each a card opening in a new tab, plus a "What's inside" panel (program listings / eligibility & timelines / live database) and an amber note that dates and small details are still being fixed by the team. New files: `src/lib/content/compendiums.ts` (content) + `src/components/resources/compendium-section.tsx`; `/resources` metadata/description updated; library empty-state copy reworded so it points at the compendiums. The generic footer/contact "Compendiums" link (`links.compendiums`) still points at the Notion index page — left untouched. Committed as `4cfdec0`, deployed and verified live.
- YLAC event + home notification (2026-10-07, fourth batch):
  - **YLAC event card:** `YLAC Policy Chapter Workshop Orientation` added — 8 Oct 2026, 7:00–9:00 pm IST, L1, organiser *YLAC Policy Chapter*, status `registration_open` (site registration enabled so the card is actionable; flip to `upcoming` if no on-site registration is wanted — no capacity/deadline set). Full copy (what you'll learn, YLAC about, SDC certificate, **WE ARE RECRUITING** Google Form) lives in the multi-line `description`. Inserted live via PostgREST (service role) and recorded as migration `supabase/migrations/20261007000000_seed_ylac_orientation.sql` (idempotent, `on conflict do nothing`).
  - **Home notification:** one pinned announcement (`YLAC Policy Chapter Workshop Orientation — 8 October`) re-added to `src/lib/content/announcements.ts`, and the home Announcements section moved to directly under the Hero so notices act as a notification banner; it re-shows the `/events#announcements` link.
  - **Home events section now reads the DB:** home used the (empty) static `content/events` file, so DB events never appeared — it now uses `listEvents()` from `events-repo` like `/events` does, which makes `/` a dynamic route.
  - **Event detail rendering:** description paragraph gets `whitespace-pre-line` (line breaks/`•` bullets render) and URLs are auto-linked (the recruitment form is clickable).
  - Verified: lint clean, build green (15 routes), local checks — announcement right after hero, YLAC card on home + in `/events` "Open now", announcements section below registration, detail shows "8 October 2026 / 7:00 pm – 9:00 pm / L1 · On campus".
- Contact purge + home CTA mailto + site-wide dark mode (2026-10-08, fifth batch):
  - **`/contact` purged:** page deleted; all links removed (navbar mobile menu, footer, `/about` "Contact SDC", `/login` "Need help?") — those two now open `mailto:sdc@iiserb.ac.in`; `next.config.ts` 308-redirects `/contact` → `/` (same mechanism as the `/announcements` redirect).
  - **Home CTA:** "Connect with us" now opens `mailto:sdc@iiserb.ac.in` (`Button` renders `mailto:`/`tel:` hrefs as a plain anchor, no new tab), and a line under the buttons shows the address and the phone `+91 79907 63453` as clickable links.
  - **Dark mode (site-wide):** new `ThemeToggle` switch immediately left of Sign In in the navbar (visible on desktop and mobile top bars; both layouts share the navbar). Built by remapping Tailwind's colour custom properties under `.dark` in `globals.css` — light mode (white + red) is untouched; dark mode flips to soft "LCD black" (`#131519`, never pure black) + SDC blue (brand scale → blue steps, richer ink-blue fills, semantic red/amber/green/emerald → dark tints with light text). Unlayered `.dark` rules handle what one variable can't serve twice: `bg-white` cards → elevated `#1a1d24`, text roles of fill-flipped variables, borders (slate-300/600 stay light because they carry footer/panel text), plus matching hover/focus rules the unlayered overrides would otherwise mask; logo chips carry a `.logo-chip` marker so the emblem always sits on white. No-flash inline script in the root layout `<head>` applies the stored theme (`sdc-theme` in localStorage) before first paint, with `suppressHydrationWarning` on `<html>`; the toggle syncs through `useSyncExternalStore` + MutationObserver. Default is light — no OS-preference sniffing.
  - Verified: lint clean, build green (14 routes — `/contact` gone), local checks — `/contact` 308 → `/`, mailto + phone on home, zero `href="/contact"` anywhere, switch SSR'd in navbar, `dark:` gradient variants sort after their bases in the compiled CSS.

- Admin foundation + public archive (2026-10-23, Phase 8a):
  - **Admin guard:** `src/lib/admin/guard.ts` `requireAdmin()` checks `users.role in ('admin','super_admin')`; redirects unauthenticated to login and non-admins home. Defense-in-depth on top of `proxy.ts` and RLS.
  - **Admin shell:** `src/app/admin/layout.tsx` (navbar + footer + admin sub-nav: Overview, Events, Resources) and `src/app/admin/page.tsx` overview (upcoming events, resources, quick actions). All admin routes noindex.
  - **Events CRUD:** `src/app/admin/events/actions.ts` (`createEvent`/`updateEvent`/`deleteEvent`) with zod validation (required fields, deadline ≤ start, end ≥ start, capacity > 0, URL checks), slug generated from title and immutable on edit, unique-violation surfaced as a field error, create as upcoming with a Registration open toggle → `registration_open`. Pages: `/admin/events` list, `/admin/events/new`, `/admin/events/[slug]/edit`.
  - **Resources CRUD:** `src/lib/resources-repo.ts` (DB with static fallback), `src/app/admin/resources/actions.ts`, pages `/admin/resources`, `/admin/resources/new`, `/admin/resources/[id]/edit` with `is_published` toggle.
  - **Navbar:** Admin link added (desktop + mobile) for admin roles, next to Dashboard.
  - **Event archive:** `/events` now has "Open now" (upcoming + events ended 0–7 days ago) and a "Concluded" section (ended >7 days ago); removed the "Slots are limited" line. Home shows only future events (`isFutureEvent`). `SDCEvent` gained `startsAt`/`endsAt` (timezone-safe ISO from the raw row) via migration `20261023000000_admin_foundation.sql`, which also added the `mode` column ('online'|'offline'|'hybrid') backfilled from `is_online`.
  - **Live cleanup:** YLAC event set to `completed` (migration `20261023000001_complete_ylac_event.sql`); pinned 7 Oct YLAC announcement removed from `announcements.ts`.
  - **CoTM:** `/cotm` shows a "Coming January 2027" panel above the explainer steps; metadata updated. Track lists dormant.
  - **Decisions:** opportunities page/compendiums/announcement admin on hold; single admin role (admins+super_admins treated alike for approve/publish/modify/reject); zod accepted; no separate draft state for events.
  - Verified: `npm run lint` clean; `npm run build` green.

- **Project review (2026-10-24):** walked the full repo — `src/app/(marketing)` public pages (Home, About, Initiatives, Events, CotM, Resources, Login, Team), `(dashboard)` dashboard, `admin` area (overview + events/resources CRUD), `auth` callback, `proxy.ts` (Next 16 session refresh + route protection), `src/lib` (events-repo, resources-repo, supabase clients, auth.ts, types, content seed), `supabase/migrations/` (7 migrations incl. `0001_init`, `seed_admin_emails`, `seed_events`, `clear_events`, `seed_ylac_orientation`, `admin_foundation`, `complete_ylac_event`). Confirmed tree matches STATE_updated.md: Phase 4 public site done, Phase 5 auth live, Phase 6 events+registration code complete, Phase 7 CotM v1 not started (Coming January 2027 panel), Phase 8a admin foundation complete and verified. Lint clean; build green.

- **Opportunities page implemented (2026-10-25):** selectively added the opportunities feature from `pr-1` without adopting pr-1's other changes (which delete the admin area, rewrite events/cotm/home/dashboard, simplify event-status/events-repo/types, remove zod). Created: `src/lib/opportunity-types.ts`, `src/lib/opportunities-repo.ts`, `src/lib/opportunities/actions.ts`, `src/components/opportunities/opportunity-card.tsx`, `src/components/opportunities/opportunity-board.tsx`, `src/components/opportunities/opportunity-form.tsx`, `src/app/(marketing)/opportunities/page.tsx`, `supabase/migrations/20261016000000_create_opportunities.sql`. Modified: `src/components/layout/navbar.tsx` (added Opportunities link), `src/components/layout/footer.tsx` (added Opportunities link). Admin area preserved intact. Lint clean (no new issues), type-check clean, production build green — `/opportunities` listed as dynamic route.

- **Opportunity filters reworked (2026-10-26):** replaced category filters (Research, Internship, Hackathon, etc.) with department filters (EECS, DSE, Biology, Chemistry, Maths, Physics, EES, Economics, Chemical Engg). Added user-submitted tags that become filterable. Both department and tag filters support multi-select on the board (`opportunity-board.tsx`) and on the upload form (`opportunity-form.tsx`). `department` and `tags` are now `text[]` arrays in the DB with GIN indexes. Migration `20261016000000_create_opportunities.sql` updated accordingly. Form validates: at least one department, max 5 tags of max 30 chars each.

- **Tags field fixed (2026-10-26):** the share form's tags control is now a multi-select dropdown of existing tags with an inline "add new tag" input; selected tags render as removable chips and are submitted via a hidden `tags` field (previously the text input submitted only the uncommitted draft text, so added tags never reached the server). `OpportunityForm` now receives `availableTags` from the board's unique tag list.

- **Opportunities schema upgrade + 500 fix (2026-10-26):** the live Supabase project still had the original `category`-based table, so `/opportunities` crashed with Postgres `42703` (`column opportunities.department does not exist`) and returned HTTP 500. Added idempotent incremental migration `20261026000000_opportunities_departments_tags.sql` (adds `department text[]` + `tags text[]` with GIN indexes, drops `category`; table was empty). `listOpportunities()` now treats `PGRST205` / `42P01` / `42703` as `migration-required`, so the board shows the setup message instead of throwing. Upload form's department control replaced with a proper multi-select dropdown (checkbox list, click-outside/Escape close, removable chips); hidden `department` inputs moved inside the `<form>` so selections actually submit. Team LinkedIn links for Angel and Dishank corrected.
- **UX + opportunities batch (2026-10-26):**
  - **Navbar:** About moved to the end of the desktop/mobile nav list; the desktop bar now uses `max-w-[96rem]` (with tighter link padding) so all links, the admin link, and the signed-in controls fit; wrapped link labels are centred.
  - **Teams page:** tenure updated to **2026–27** in the eyebrow, title, and description.
  - **Initiatives:** added **YLAC Policy Collective — IISER Bhopal Chapter**; **Placements & Internships** description now reads "Aid the CCD office to conduct placement and career related activities"; the page intro no longer hardcodes "Six" verticals.
  - **Opportunities — contributor:** optional `contributor_name` field on the share form (blank = anonymous), stored in the new `contributor_name` column and shown as "Contributed by …" on each card. Added `supabase/migrations/20261026000100_opportunity_contributor.sql` (idempotent); base create migration updated for fresh installs.
  - **Opportunities — tags:** tags are now a curated multi-select of the PR-1 board categories plus Industry and Academia (`Research`, `Internship`, `Hackathon`, `Industry`, `Academia`, `Job`, `Campus project`, `Fellowship`, `Competition`, `Other`), replacing free-text tags. Server action validates against the list.

- **SEO foundation (2026-10-26):**
  - **Canonical + titles:** added `src/lib/seo.ts` (`siteUrl`, `absoluteUrl`, `pageMetadata()`) and routed every public page through it, so each page now has a unique title, description, canonical URL, and per-page Open Graph/Twitter card instead of inheriting the home page's. Document titles use the `%s | SDC IISER Bhopal` template; the home title now names the council and the institute.
  - **Crawlability:** added `src/app/robots.ts` (allows public pages, blocks `/admin`, `/dashboard`, `/login`, `/auth`, `/api`; advertises the sitemap) and `src/app/sitemap.ts` (all public routes, live event slugs from Supabase, CoTM tracks; revalidates hourly; cancelled events excluded).
  - **Structured data:** `src/lib/structured-data.ts` + `src/components/seo/json-ld.tsx` emit schema.org `Organization` + `WebSite` site-wide and `Event` markup on event detail pages (dates, venue/online mode, organizer, free entry).
  - **Social card:** added a branded 1200×630 `public/og.png` (previously the 1402×1404 hero JPEG was used, which cropped badly on every share) plus `scripts/generate-og-image.mjs` to regenerate it.
  - **Metadata hygiene:** `themeColor` moved from `metadata` to the `viewport` export (deprecated since Next 14), `lang` set to `en-IN`, login marked `noindex`, and optional `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` support added for Search Console.

- **Admin events list 500 fixed (2026-10-26):** `/admin/events` returned "This page couldn't load / A server error occurred" while `/admin/events/new` worked. Cause: the list page is a Server Component but passed an `onClick` confirm handler to the Delete `<button>`, which React rejects at request time ("Event handlers cannot be passed to Client Component props") — the same latent bug existed on `/admin/resources`. Moved the confirmation into `src/components/admin/confirm-submit-button.tsx` (`"use client"`) and used it in both list pages. Reproduced the 500 locally and confirmed 200 after the fix; no server component now passes event handlers.

- **Role-change guard (2026-10-26):** added `supabase/migrations/20261026000200_guard_role_changes.sql`. The `users: update own row or admin` RLS policy is row-level, so any `admin` could promote themselves (or anyone) to `super_admin` via the PostgREST API. A `before insert or update` trigger (`users_guard_role_change`) now rejects role changes unless the caller is a super admin, while direct SQL (migrations, SQL editor, the `handle_new_user` trigger) and the service role stay trusted. README documents the two-table admin workflow (`admin_emails` + `users.role`).
