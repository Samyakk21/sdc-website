create table public.opportunities (
  id             uuid primary key default gen_random_uuid(),
  title          text not null check (char_length(btrim(title)) between 5 and 160),
  organization   text not null check (char_length(btrim(organization)) between 2 and 120),
  category       text not null check (category in (
                   'Research', 'Internship', 'Hackathon', 'Job',
                   'Campus project', 'Fellowship', 'Competition', 'Other'
                 )),
  description    text not null check (char_length(btrim(description)) between 20 and 2000),
  deadline       date,
  application_url text not null check (application_url ~ '^https?://'),
  submitted_by   uuid not null references public.users (id) on delete cascade,
  upvote_count   integer not null default 0 check (upvote_count >= 0),
  created_at     timestamptz not null default now()
);

create index opportunities_created_at_idx on public.opportunities (created_at desc);
create index opportunities_upvote_count_idx on public.opportunities (upvote_count desc);
create index opportunities_category_idx on public.opportunities (category);

alter table public.opportunities enable row level security;

create policy "opportunities: public read"
  on public.opportunities for select
  using (true);

create policy "opportunities: authenticated submit"
  on public.opportunities for insert
  with check (auth.uid() = submitted_by);

create policy "opportunities: admin update"
  on public.opportunities for update
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy "opportunities: author or admin delete"
  on public.opportunities for delete
  using (auth.uid() = submitted_by or public.is_admin(auth.uid()));

create table public.opportunity_votes (
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  user_id        uuid not null references public.users (id) on delete cascade,
  created_at     timestamptz not null default now(),
  primary key (opportunity_id, user_id)
);

create index opportunity_votes_user_idx on public.opportunity_votes (user_id);

alter table public.opportunity_votes enable row level security;

create policy "opportunity votes: read own"
  on public.opportunity_votes for select
  using (auth.uid() = user_id);

create policy "opportunity votes: vote as self"
  on public.opportunity_votes for insert
  with check (auth.uid() = user_id);

create policy "opportunity votes: remove own vote"
  on public.opportunity_votes for delete
  using (auth.uid() = user_id);

create or replace function public.update_opportunity_vote_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.opportunities
    set upvote_count = upvote_count + 1
    where id = new.opportunity_id;
    return new;
  end if;

  update public.opportunities
  set upvote_count = greatest(upvote_count - 1, 0)
  where id = old.opportunity_id;
  return old;
end;
$$;

create trigger opportunity_votes_update_count
  after insert or delete on public.opportunity_votes
  for each row execute function public.update_opportunity_vote_count();
