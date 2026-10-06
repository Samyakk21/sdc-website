-- Clear every event: the events tab starts empty, no seeded demo events.
-- (the original seed lives in 20260917000200_seed_events.sql; this supersedes it)
--
-- registrations / attendance / certificates / track_events reference events
-- with on delete cascade, so they go with them.
delete from public.events;
