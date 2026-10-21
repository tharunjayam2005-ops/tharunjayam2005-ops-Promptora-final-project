-- Run in Supabase SQL Editor (new installs or existing projects).
create table if not exists public.user_api_keys (
  user_id uuid primary key references auth.users(id) on delete cascade,
  openrouter_key text not null default '',
  gemini_key text not null default '',
  custom_models jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Add column if table already existed without it
alter table public.user_api_keys
  add column if not exists custom_models jsonb not null default '[]'::jsonb;

alter table public.user_api_keys enable row level security;

drop policy if exists "Users can view own api keys" on public.user_api_keys;
drop policy if exists "Users can insert own api keys" on public.user_api_keys;
drop policy if exists "Users can update own api keys" on public.user_api_keys;
drop policy if exists "Users can delete own api keys" on public.user_api_keys;

create policy "Users can view own api keys"
  on public.user_api_keys
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own api keys"
  on public.user_api_keys
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own api keys"
  on public.user_api_keys
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own api keys"
  on public.user_api_keys
  for delete
  to authenticated
  using (auth.uid() = user_id);
