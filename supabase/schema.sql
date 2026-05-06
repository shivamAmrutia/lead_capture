create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  company text,
  source text not null check (source in ('Google', 'Referral', 'Social', 'Other')),
  message text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

drop policy if exists "Block anonymous lead reads" on public.leads;
create policy "Block anonymous lead reads"
on public.leads
for select
to anon
using (false);

drop policy if exists "Block anonymous lead writes" on public.leads;
create policy "Block anonymous lead writes"
on public.leads
for insert
to anon
with check (false);

create index if not exists leads_created_at_idx
on public.leads (created_at desc);
