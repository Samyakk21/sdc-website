-- ============================================================================
-- SDC Website — Phase 8a events CRUD
-- Adds a `mode` text column ('online' | 'offline' | 'hybrid') to public.events,
-- backfilled from `is_online`, and keeps `is_online` for backward compatibility.
-- ============================================================================

alter table public.events
  add column if not exists mode text
    check (mode in ('online', 'offline', 'hybrid'))
    not null default 'offline';

update public.events
  set mode = case when is_online then 'online' else 'offline' end
  where mode is null;

create index if not exists events_mode_idx on public.events (mode);
