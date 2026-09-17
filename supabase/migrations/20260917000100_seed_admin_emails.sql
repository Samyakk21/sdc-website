-- ============================================================================
-- SDC Website — seed admin allowlist
-- Approved IISERB addresses entitled to elevated roles.
-- Advance SDC: samyak25@iiserb.ac.in (super admin).
-- ============================================================================
insert into public.admin_emails (email, role)
values ('samyak25@iiserb.ac.in', 'super_admin')
on conflict (email) do update set role = excluded.role;