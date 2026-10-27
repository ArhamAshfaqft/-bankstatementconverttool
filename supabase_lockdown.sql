-- Run this once in the existing Supabase project if the old account system was deployed.
-- It disables client access to legacy profiles without deleting customer records.
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update own profile." on public.profiles;
revoke all on table public.profiles from anon, authenticated;
