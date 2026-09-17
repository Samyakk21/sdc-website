-- ============================================================================
-- SDC Website — Phase 5 schema (Supabase / PostgreSQL)
-- Identity users live in auth.users; public.users mirrors them via triggers.
-- Attendance and certificates exist as unused hooks (schema-ready, no UI/logic).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- users: public profile mirror of auth.users
-- ----------------------------------------------------------------------------
create table public.users (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text not null unique,
  full_name  text,
  avatar_url text,
  role       text not null default 'student'
               check (role in ('student', 'admin', 'super_admin')),
  created_at timestamptz not null default now()
);

create index users_role_idx on public.users (role);

-- ----------------------------------------------------------------------------
-- Role helpers (security definer so RLS policies can call them without
-- causing recursive RLS evaluation on public.users). Created after public.users
-- because SQL-language functions are parsed at creation time.
-- ----------------------------------------------------------------------------
create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users u
    where u.id = user_id
      and u.role in ('admin', 'super_admin')
  );
$$;

create or replace function public.is_super_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users u
    where u.id = user_id and u.role = 'super_admin'
  );
$$;

alter table public.users enable row level security;

create policy "users: read own row or admin"
  on public.users for select
  using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "users: insert self"
  on public.users for insert
  with check (auth.uid() = id);

create policy "users: update own row or admin"
  on public.users for update
  using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "users: delete admin"
  on public.users for delete
  using (public.is_admin(auth.uid()));

-- ----------------------------------------------------------------------------
-- admin_emails: approved IISERB addresses entitled to elevated roles.
-- Seed values are added in a follow-up migration once confirmed by SDC.
-- ----------------------------------------------------------------------------
create table public.admin_emails (
  email    text primary key,
  role     text not null check (role in ('admin', 'super_admin')),
  added_at timestamptz not null default now()
);

alter table public.admin_emails enable row level security;

create policy "admin_emails: admins read"
  on public.admin_emails for select
  using (public.is_admin(auth.uid()));

create policy "admin_emails: super admin manage"
  on public.admin_emails for all
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- ----------------------------------------------------------------------------
-- Auth triggers
-- 1. Reject sign-ups from outside @iiserb.ac.in (defense in depth; the primary
--    UX gate is the Google `hd=iiserb.ac.in` parameter sent at sign-in time).
-- 2. Auto-create/refresh the public.users row from auth.users.
-- ----------------------------------------------------------------------------
create or replace function public.require_iiserb_domain()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if upper(substring(new.email from '@(.*)$')) <> 'IISERB.AC.IN' then
    raise exception 'Only @iiserb.ac.in accounts are allowed to sign in.';
  end if;
  return new;
end;
$$;

create trigger require_iiserb_domain
  before insert or update of email on auth.users
  for each row execute function public.require_iiserb_domain();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role text;
begin
  select coalesce(
    (select e.role from public.admin_emails e where e.email = new.email),
    'student'
  ) into assigned_role;

  insert into public.users (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    assigned_role
  )
  on conflict (id) do update
    set email      = excluded.email,
        full_name  = excluded.full_name,
        avatar_url = excluded.avatar_url,
        role       = excluded.role;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Generic updated_at trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- events
-- ----------------------------------------------------------------------------
create table public.events (
  id                    uuid primary key default gen_random_uuid(),
  slug                  text not null unique,
  title                 text not null,
  tagline               text,
  description           text,
  banner_url            text,
  status                text not null default 'upcoming'
                          check (status in ('upcoming', 'registration_open',
                                            'registration_closed', 'ongoing',
                                            'completed', 'cancelled')),
  starts_at             timestamptz not null,
  ends_at               timestamptz,
  is_online             boolean not null default false,
  location              text,
  capacity              integer check (capacity is null or capacity > 0),
  registration_deadline timestamptz,
  organizer             text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index events_status_idx on public.events (status);
create index events_starts_at_idx on public.events (starts_at);

alter table public.events enable row level security;

create policy "events: public read"
  on public.events for select using (true);

create policy "events: admin insert"
  on public.events for insert with check (public.is_admin(auth.uid()));

create policy "events: admin update"
  on public.events for update using (public.is_admin(auth.uid()));

create policy "events: admin delete"
  on public.events for delete using (public.is_admin(auth.uid()));

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- registrations
-- ----------------------------------------------------------------------------
create table public.registrations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users (id) on delete cascade,
  event_id      uuid not null references public.events (id) on delete cascade,
  status        text not null default 'registered'
                  check (status in ('registered', 'cancelled')),
  registered_at timestamptz not null default now(),
  cancelled_at  timestamptz
);

-- One active registration per student+event, but a cancelled registration
-- may be re-registered later.
create unique index registrations_one_active_per_event
  on public.registrations (user_id, event_id)
  where status = 'registered';

create index registrations_event_idx on public.registrations (event_id);
create index registrations_user_idx on public.registrations (user_id);

alter table public.registrations enable row level security;

create policy "registrations: read own or admin"
  on public.registrations for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "registrations: register self"
  on public.registrations for insert
  with check (auth.uid() = user_id);

create policy "registrations: cancel own or admin"
  on public.registrations for update
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "registrations: delete admin"
  on public.registrations for delete
  using (public.is_admin(auth.uid()));

-- ----------------------------------------------------------------------------
-- attendance — schema-ready hook; no feature logic yet
-- ----------------------------------------------------------------------------
create table public.attendance (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users (id) on delete cascade,
  event_id    uuid not null references public.events (id) on delete cascade,
  status      text not null default 'present'
                check (status in ('present', 'absent')),
  recorded_at timestamptz not null default now(),
  recorded_by uuid references public.users (id),
  constraint attendance_once_per_event unique (user_id, event_id)
);

alter table public.attendance enable row level security;

create policy "attendance: read own or admin"
  on public.attendance for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "attendance: admin manage"
  on public.attendance for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ----------------------------------------------------------------------------
-- tracks (Career of the Month) and related
-- ----------------------------------------------------------------------------
create table public.tracks (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null unique,
  title                text not null,
  tagline              text,
  intro                text,
  why                  text,
  category             text,
  status               text not null default 'planned'
                         check (status in ('draft', 'planned', 'active', 'completed')),
  progress_rule        jsonb not null default '{"type": "registration_ratio"}'::jsonb,
  completion_threshold numeric not null default 0.8
                         check (completion_threshold between 0 and 1),
  starts_at            timestamptz,
  ends_at              timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index tracks_status_idx on public.tracks (status);

alter table public.tracks enable row level security;

create policy "tracks: public read non-draft"
  on public.tracks for select
  using (status <> 'draft');

create policy "tracks: admin insert"
  on public.tracks for insert with check (public.is_admin(auth.uid()));

create policy "tracks: admin update"
  on public.tracks for update using (public.is_admin(auth.uid()));

create policy "tracks: admin delete"
  on public.tracks for delete using (public.is_admin(auth.uid()));

create trigger tracks_set_updated_at
  before update on public.tracks
  for each row execute function public.set_updated_at();

create table public.track_events (
  track_id uuid not null references public.tracks (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  position integer not null default 0,
  primary key (track_id, event_id)
);

alter table public.track_events enable row level security;

create policy "track_events: public read"
  on public.track_events for select using (true);

create policy "track_events: admin manage"
  on public.track_events for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create table public.track_enrollments (
  user_id     uuid not null references public.users (id) on delete cascade,
  track_id    uuid not null references public.tracks (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

create index track_enrollments_track_idx on public.track_enrollments (track_id);

alter table public.track_enrollments enable row level security;

create policy "track_enrollments: read own or admin"
  on public.track_enrollments for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "track_enrollments: enroll self"
  on public.track_enrollments for insert
  with check (auth.uid() = user_id);

create policy "track_enrollments: admin manage"
  on public.track_enrollments for update
  using (public.is_admin(auth.uid()));

create policy "track_enrollments: admin delete"
  on public.track_enrollments for delete
  using (public.is_admin(auth.uid()));

-- ----------------------------------------------------------------------------
-- progress: snapshot table; Phase 7 computes values via DB-configured rules
-- ----------------------------------------------------------------------------
create table public.progress (
  user_id      uuid not null references public.users (id) on delete cascade,
  track_id     uuid not null references public.tracks (id) on delete cascade,
  value        numeric not null default 0 check (value between 0 and 1),
  status       text not null default 'not_started'
                 check (status in ('not_started', 'in_progress', 'completed')),
  completed_at timestamptz,
  updated_at   timestamptz not null default now(),
  primary key (user_id, track_id)
);

create index progress_track_idx on public.progress (track_id);

alter table public.progress enable row level security;

create policy "progress: read own or admin"
  on public.progress for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "progress: update self or admin"
  on public.progress for insert
  with check (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "progress: update self or admin 2"
  on public.progress for update
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "progress: delete admin"
  on public.progress for delete
  using (public.is_admin(auth.uid()));

create trigger progress_set_updated_at
  before update on public.progress
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- resources
-- ----------------------------------------------------------------------------
create table public.resources (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  type         text not null
                 check (type in ('pdf', 'article', 'video', 'website',
                                 'roadmap', 'book', 'tutorial', 'presentation')),
  category     text,
  url          text not null,
  author       text,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index resources_type_idx on public.resources (type);
create index resources_category_idx on public.resources (category);

alter table public.resources enable row level security;

create policy "resources: public read published"
  on public.resources for select
  using (is_published);

create policy "resources: admin insert"
  on public.resources for insert with check (public.is_admin(auth.uid()));

create policy "resources: admin update"
  on public.resources for update using (public.is_admin(auth.uid()));

create policy "resources: admin delete"
  on public.resources for delete using (public.is_admin(auth.uid()));

create trigger resources_set_updated_at
  before update on public.resources
  for each row execute function public.set_updated_at();

create table public.track_resources (
  track_id    uuid not null references public.tracks (id) on delete cascade,
  resource_id uuid not null references public.resources (id) on delete cascade,
  position    integer not null default 0,
  primary key (track_id, resource_id)
);

alter table public.track_resources enable row level security;

create policy "track_resources: public read"
  on public.track_resources for select using (true);

create policy "track_resources: admin manage"
  on public.track_resources for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ----------------------------------------------------------------------------
-- announcements
-- ----------------------------------------------------------------------------
create table public.announcements (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  body         text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_by   uuid references public.users (id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index announcements_published_at_idx
  on public.announcements (published_at) where is_published;

alter table public.announcements enable row level security;

create policy "announcements: public read published"
  on public.announcements for select
  using (is_published);

create policy "announcements: admin insert"
  on public.announcements for insert with check (public.is_admin(auth.uid()));

create policy "announcements: admin update"
  on public.announcements for update using (public.is_admin(auth.uid()));

create policy "announcements: admin delete"
  on public.announcements for delete using (public.is_admin(auth.uid()));

create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- certificates — schema-ready hook; generation/revocation handled later
-- ----------------------------------------------------------------------------
create table public.certificates (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users (id) on delete cascade,
  event_id   uuid references public.events (id) on delete cascade,
  track_id   uuid references public.tracks (id) on delete cascade,
  kind       text not null check (kind in ('event', 'cotm')),
  issued_at  timestamptz not null default now(),
  revoked_at timestamptz,
  constraint certificates_require_source check (event_id is not null or track_id is not null)
);

create index certificates_user_idx on public.certificates (user_id);

alter table public.certificates enable row level security;

create policy "certificates: read own or admin"
  on public.certificates for select
  using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "certificates: admin issue"
  on public.certificates for insert with check (public.is_admin(auth.uid()));

create policy "certificates: admin update"
  on public.certificates for update using (public.is_admin(auth.uid()));

create policy "certificates: admin delete"
  on public.certificates for delete using (public.is_admin(auth.uid()));