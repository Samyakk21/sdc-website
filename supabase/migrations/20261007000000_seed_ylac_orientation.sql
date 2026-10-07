-- YLAC Policy Chapter Workshop Orientation
-- 8 October 2026, 19:00–21:00 IST, L1 — organised by the YLAC Policy Chapter.
-- Applied to the live project through the PostgREST API (service role);
-- running this file in the SQL editor produces the same row (idempotent).

insert into public.events (
  slug, title, tagline, description, status, starts_at, ends_at,
  is_online, location, organizer
)
values (
  'ylac-policy-chapter-workshop-orientation',
  'YLAC Policy Chapter Workshop Orientation',
  'An interactive session on mastering policy case competitions.',
  $$Looking to learn how policy problems are analysed and transformed into practical solutions? Join the YLAC Policy Chapter Workshop Orientation — an interactive session on mastering Policy Case Competitions!

What you'll learn:
• Root Cause Analysis: uncovering real issues behind policy failures.
• Stakeholder Mapping: designing solutions that work for all key actors.
• Smart Research: sourcing reliable data and evidence quickly.
• Feasible Solutions: creating realistic plans within budgets and legal frameworks.
• Effective Pitching: packaging recommendations into winning presentations.

About YLAC Policy Chapter: a student-led platform at IISER Bhopal for exploring public policy through real-world data, mentored projects, and case competitions. Open to all academic disciplines — no prior experience required!

Participants will receive an official certificate from the Student Development Council (SDC) upon completion.

WE ARE RECRUITING! Want to be part of the team working on this? Recruitment form: https://docs.google.com/forms/d/e/1FAIpQLScvyIkE8SEJA_Yxh313tk5gNZOuOk5CvToFAk_wcsIYQLJCpw/viewform?usp=publish-editor$$,
  'registration_open',
  '2026-10-08 19:00:00+05:30',
  '2026-10-08 21:00:00+05:30',
  false,
  'L1',
  'YLAC Policy Chapter'
)
on conflict (slug) do nothing;
