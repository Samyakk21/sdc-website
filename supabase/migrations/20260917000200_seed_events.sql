-- ============================================================================
-- SDC Website — Phase 6 seed data
-- 1. Seed the events catalog so the public pages have content out of the box.
-- 2. count_active_registrations RPC (security definer) so the UI can show
--    seat availability without exposing individual registration rows.
-- ============================================================================

insert into public.events (
  slug, title, description, status, starts_at, ends_at, is_online, location,
  capacity, registration_deadline, organizer
)
values
  (
    'career-talk-data-science-ai',
    'Career Talk: Careers in Data Science & AI',
    'Industry practitioners break down the pathways into data science and AI — skills, portfolios, and what recruiters actually look for.',
    'registration_open',
    '2026-10-05 17:00:00+05:30',
    '2026-10-05 18:30:00+05:30',
    false,
    'LN-101, Academic Block 2',
    120,
    '2026-10-03 23:59:59+05:30',
    'Career Talks & Orientations'
  ),
  (
    'internship-application-workshop',
    'Internship Application Workshop',
    'A hands-on session covering CV tailoring, research statements, and application strategies for internships at IISERs, institutes, and industry.',
    'registration_open',
    '2026-09-28 16:00:00+05:30',
    '2026-09-28 17:30:00+05:30',
    false,
    'LN-201, Academic Block 2',
    80,
    '2026-09-26 23:59:59+05:30',
    'Placements & Internships'
  ),
  (
    'cotm-quantum-kickoff',
    'Quantum Computing: Kickoff & Roadmap Session',
    'The opening session of Career of the Month — understand the field, the track roadmap, and how to make the most of the month ahead.',
    'registration_open',
    '2026-10-03 18:00:00+05:30',
    '2026-10-03 19:00:00+05:30',
    true,
    'Online',
    200,
    '2026-10-02 23:59:59+05:30',
    'Career of the Month'
  ),
  (
    'cotm-quantum-expert-session',
    'Quantum Computing: Expert Session',
    'An expert deep-dive into quantum algorithms and where quantum computing is heading — from theory to real hardware.',
    'upcoming',
    '2026-10-10 18:00:00+05:30',
    '2026-10-10 19:30:00+05:30',
    true,
    'Online',
    200,
    '2026-10-09 23:59:59+05:30',
    'Career of the Month'
  ),
  (
    'resume-cv-clinic',
    'Resume & CV Clinic',
    'Bring your draft resume for a guided review session with seniors who have landed offers and internships across sectors.',
    'upcoming',
    '2026-10-08 16:30:00+05:30',
    '2026-10-08 18:00:00+05:30',
    false,
    'SDC Room, 1st Floor, Mess 3',
    40,
    '2026-10-06 23:59:59+05:30',
    'Placements & Internships'
  ),
  (
    'cotm-quantum-challenge',
    'Quantum Computing: Challenge',
    'The closing activity of Career of the Month — solve a hands-on challenge and consolidate what you\'ve learned across the month.',
    'registration_closed',
    '2026-10-17 14:00:00+05:30',
    '2026-10-17 18:00:00+05:30',
    true,
    'Online',
    null,
    null,
    'Career of the Month'
  ),
  (
    'mun-2026-info-session',
    'MUN 2026: Information Session',
    'Everything you need to know about committees, portfolios, and how to register for IISER Bhopal\'s Model United Nations conference.',
    'completed',
    '2026-08-20 17:00:00+05:30',
    '2026-08-20 18:00:00+05:30',
    false,
    'LN-301, Academic Block 2',
    null,
    null,
    'MUN'
  ),
  (
    'aptitude-mock-series',
    'Placement Prep: Aptitude Mock',
    'A timed mock aptitude assessment with a detailed solutions discussion, part of the placement preparation series.',
    'completed',
    '2026-08-29 15:00:00+05:30',
    '2026-08-29 17:00:00+05:30',
    true,
    'Online',
    null,
    null,
    'Placements & Internships'
  )
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- Active registration count (security definer: aggregate only, no row exposure).
-- ----------------------------------------------------------------------------
create or replace function public.count_active_registrations(p_event_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.registrations r
  where r.event_id = p_event_id
    and r.status = 'registered';
$$;