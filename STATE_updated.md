# SDC Website — Project State
**Last Updated:** 2026-09-17

## Project Overview
- **Project Name:** SDC Website
- **Organization:** Student Development Council (SDC), IISER Bhopal
- **Current Website:** https://sdcwebsite.vercel.app/
- **Project Role:** User is the tech lead of SDC; AI acts as developer/architect.
- **Status:** Architecture and MVP approved. Phase 4 (public website build) pending start.

## Current Objective
- Build an SDC digital platform: a public website plus an authenticated student platform, delivered as one coherent product.
- Implement incrementally in approved milestones. Do not build unapproved features.

## Approved Decisions
- **Tech stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS. Supabase provides Postgres database, Google Auth, Storage, and Row-Level Security. Deploy on Vercel.
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
| Decide technical architecture | Approved | Next.js + Supabase + Vercel. |
| Authentication model | Approved | Google, `@iiserb.ac.in` only. |
| Sitemap | Approved | See below. |
| Define database schema | Pending | Next step with Supabase SQL migration. |
| Design direction | Approved (base) | Palette/typography final pass during design phase. |
| Build public pages | Not started | Phase 4. |
| Authentication implementation | Not started | Phase 5. |
| Events + registration | Not started | Phase 6. |
| CotM v1 | Not started | Phase 7. |
| Admin interface | Not started | Phase 8. |
| Attendance framework | Deferred | Schema-ready only. |
| Certificates | Deferred | Schema-ready only. |

## Sitemap (Approved)
- **Public:** `/` Home, `/about`, `/initiatives`, `/events` (+ `/events/[slug]`), `/cotm` + `/cotm/[slug]`, `/resources`, `/announcements`, `/contact`, `/login`.
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
- Admin identification/seeding: which emails become Admins/Super Admins and how.
- Final palette/typography choice.
- Event registration defaults: capacity numbers, cancellation allowed?, auto certificate (deferred).
- CotM: initial track topic/date for first run.

## Development Rules
- Follow the user's latest instructions as source of truth.
- No major design/feature/technical decisions without approval; explain rationale, trade-offs, and alternatives.
- Work in small, reviewable milestones; test each feature before moving on.
- Do not claim incomplete work is complete.
- Do not commit secrets or `.env`. Provide `.gitignore`.
- Keep public pages SEO-friendly; keep authenticated pages unindexed.
- Accessibility and security considered from the start.

## Current Blocker
- None. Ready to begin Phase 4 scaffolding on approval.

## Current Progress
- Full brief understood; existing site reviewed; architecture, auth, sitemap, release scope, and CotM v1 approved.
- Next: scaffold the project and build public pages (Phase 4).