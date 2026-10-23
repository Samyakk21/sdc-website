-- ============================================================================
-- SDC Website — Immediate live cleanup (Track 2.2)
-- Mark the past YLAC orientation event as completed so it stops appearing as
-- upcoming. Idempotent.
-- ============================================================================

update public.events
  set status = 'completed',
      updated_at = now()
where slug = 'ylac-policy-chapter-workshop-orientation'
  and status <> 'completed';
