-- ============================================================================
-- SDC Website — Phase 6 migration
-- The event catalog seed that used to live here has been removed: the public
-- events table starts empty and stays managed from now on (see
-- 20261006000000_clear_events.sql, which wipes any seeded rows).
-- This migration now only carries the seat-count RPC below.
-- ============================================================================

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
