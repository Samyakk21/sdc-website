-- ============================================================================
-- SDC Website — Opportunities: contributor name snapshot
--
-- Posts are attributed to the signed-in account, not a name typed into the
-- form. `contributor_name` is a display snapshot of the profile name at post
-- time; `submitted_by` remains the authoritative owner for per-user stats.
--
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

-- Backfill existing posts from the submitter's profile. `full_name` is the
-- Google display name; fall back to the email handle when it is blank.
update public.opportunities o
set contributor_name = left(
  coalesce(
    nullif(btrim(u.full_name), ''),
    split_part(u.email, '@', 1)
  ),
  60
)
from public.users u
where u.id = o.submitted_by
  and o.contributor_name is null;
