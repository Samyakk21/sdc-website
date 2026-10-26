-- ============================================================================
-- Only super admins may change public.users.role
--
-- The `users: update own row or admin` RLS policy is row-level, so it also let
-- a plain admin promote themselves (or anyone) to super_admin through the
-- PostgREST API. RLS cannot restrict a single column, so this trigger guards
-- the role field itself.
--
-- Trusted contexts are still allowed to set roles:
--   * direct SQL (migrations, Supabase SQL editor, auth triggers) — no JWT
--   * the service role key — server-side only, never shipped to browsers
-- Everyone else must be a super admin.
-- ============================================================================

create or replace function public.enforce_role_change_permission()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt_role text;
begin
  -- No role change on update, and self-signup inserts default to student.
  if tg_op = 'UPDATE' then
    if new.role is not distinct from old.role then
      return new;
    end if;
  elsif tg_op = 'INSERT' then
    if new.role = 'student' then
      return new;
    end if;
  end if;

  jwt_role := coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role',
    ''
  );

  -- Direct SQL and the service role are trusted; end-user requests are not.
  if jwt_role = '' or jwt_role = 'service_role' then
    return new;
  end if;

  if not public.is_super_admin(auth.uid()) then
    raise exception 'Only super admins can change user roles.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists users_guard_role_change on public.users;

create trigger users_guard_role_change
  before insert or update on public.users
  for each row execute function public.enforce_role_change_permission();
