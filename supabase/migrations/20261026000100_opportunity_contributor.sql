-- ============================================================================
-- SDC Website — Opportunities: optional public contributor name
--
-- Posters can choose to show a name/handle alongside their submission.
-- Safe to run more than once.
-- ============================================================================

alter table public.opportunities
  add column if not exists contributor_name text;

alter table public.opportunities
  drop constraint if exists opportunities_contributor_name_check;

alter table public.opportunities
  add constraint opportunities_contributor_name_check
  check (
    contributor_name is null
    or char_length(btrim(contributor_name)) between 1 and 60
  );
