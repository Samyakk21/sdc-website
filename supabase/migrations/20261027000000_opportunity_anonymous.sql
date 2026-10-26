-- ============================================================================
-- SDC Website — Opportunities: anonymous posting
--
-- Posts stay attributed to the signed-in account (`submitted_by` plus the
-- `contributor_name` display snapshot) so per-user upvote totals can be
-- aggregated later. `is_anonymous` only controls whether that name is shown
-- on the public board.
--
-- Self-contained: also ensures `contributor_name` exists, so running this one
-- file is enough. Safe to run more than once.
-- ============================================================================

alter table public.opportunities
  add column if not exists contributor_name text;

alter table public.opportunities
  add column if not exists is_anonymous boolean not null default false;

alter table public.opportunities
  drop constraint if exists opportunities_contributor_name_check;

alter table public.opportunities
  add constraint opportunities_contributor_name_check
  check (
    contributor_name is null
    or char_length(btrim(contributor_name)) between 1 and 60
  );

-- Backfill attribution for posts made before names were captured.
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
