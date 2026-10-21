create extension if not exists pgcrypto;

-- =========================
-- Profiles
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text not null default '',
  bio text not null default '',
  avatar_url text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can view own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Create profile automatically on signup (bypasses RLS via security definer)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data->>'name', ''),
      nullif(new.raw_user_meta_data->>'full_name', ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do update
    set
      email = excluded.email,
      name = coalesce(nullif(excluded.name, ''), public.profiles.name),
      updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Safe profile upsert for logged-in users (avoids client RLS race)
create or replace function public.ensure_profile(
  p_name text default '',
  p_bio text default '',
  p_avatar_url text default ''
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.profiles;
  current_user_id uuid := auth.uid();
  current_email text := coalesce(auth.jwt() ->> 'email', '');
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.profiles (id, email, name, bio, avatar_url)
  values (
    current_user_id,
    current_email,
    coalesce(nullif(trim(p_name), ''), split_part(current_email, '@', 1), 'Creator'),
    coalesce(p_bio, ''),
    coalesce(p_avatar_url, '')
  )
  on conflict (id) do update
    set
      email = excluded.email,
      name = coalesce(nullif(trim(excluded.name), ''), public.profiles.name),
      bio = excluded.bio,
      avatar_url = case
        when nullif(trim(excluded.avatar_url), '') is null then public.profiles.avatar_url
        else excluded.avatar_url
      end,
      updated_at = timezone('utc', now())
  returning * into result;

  return result;
end;
$$;

revoke all on function public.ensure_profile(text, text, text) from public;
grant execute on function public.ensure_profile(text, text, text) to authenticated;

-- =========================
-- Prompts
-- =========================
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  idea text not null,
  model text not null check (model in ('text', 'image', 'video')),
  audience text not null,
  style text not null,
  tone text not null,
  prompt text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists prompts_user_id_created_at_idx
  on public.prompts (user_id, created_at desc);

alter table public.prompts enable row level security;

drop policy if exists "Users can view own prompts" on public.prompts;
drop policy if exists "Users can insert own prompts" on public.prompts;
drop policy if exists "Users can update own prompts" on public.prompts;
drop policy if exists "Users can delete own prompts" on public.prompts;

create policy "Users can view own prompts"
  on public.prompts
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own prompts"
  on public.prompts
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own prompts"
  on public.prompts
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own prompts"
  on public.prompts
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- =========================
-- Avatar storage
-- =========================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;

create policy "Avatar images are publicly accessible"
  on storage.objects
  for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own avatar"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- =========================
-- User API keys (Settings)
-- =========================
create table if not exists public.user_api_keys (
  user_id uuid primary key references auth.users(id) on delete cascade,
  openrouter_key text not null default '',
  gemini_key text not null default '',
  custom_models jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

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

