-- ============================================================================
-- SDC Website — Opportunities board: category -> department + tags upgrade
--
-- The first opportunities migration shipped with a single `category` column.
-- The board now uses multi-select departments and user-defined tags, stored as
-- text[] arrays. The table is empty at the time of this migration, so the old
-- column can be dropped safely.
--
-- Safe to run on a fresh database too: every statement is idempotent.
-- ============================================================================

alter table public.opportunities
  add column if not exists department text[] not null default '{}',
  add column if not exists tags text[] not null default '{}';

alter table public.opportunities
  drop column if exists category;

create index if not exists opportunities_department_idx
  on public.opportunities using gin (department);

create index if not exists opportunities_tags_idx
  on public.opportunities using gin (tags);
