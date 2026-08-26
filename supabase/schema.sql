-- Replace YOUR_ADMIN_EMAIL before running this file in the Supabase SQL editor.

create table if not exists public.resume_drafts (
  locale text primary key check (locale in ('en', 'zh')),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.resume_published (
  locale text primary key check (locale in ('en', 'zh')),
  content jsonb not null,
  published_at timestamptz not null default now()
);

alter table public.resume_drafts enable row level security;
alter table public.resume_published enable row level security;

grant select, insert, update, delete on public.resume_drafts to authenticated;
grant select on public.resume_published to anon, authenticated;

drop policy if exists "administrator manages drafts" on public.resume_drafts;
create policy "administrator manages drafts"
  on public.resume_drafts
  for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL')
  with check ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');

drop policy if exists "published resumes are public" on public.resume_published;
create policy "published resumes are public"
  on public.resume_published
  for select
  to anon, authenticated
  using (true);

create or replace function public.publish_resume(target_locale text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if (auth.jwt() ->> 'email') <> 'YOUR_ADMIN_EMAIL' then
    raise exception 'Not authorized';
  end if;

  insert into public.resume_published (locale, content, published_at)
  select locale, content, now()
  from public.resume_drafts
  where locale = target_locale
  on conflict (locale) do update
    set content = excluded.content,
        published_at = excluded.published_at;

  if not found then
    raise exception 'No draft exists for locale %', target_locale;
  end if;
end;
$$;

revoke all on function public.publish_resume(text) from public, anon;
grant execute on function public.publish_resume(text) to authenticated;
