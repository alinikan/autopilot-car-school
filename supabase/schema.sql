-- Run once in the intended Supabase project. No service-role key is used by the app.
create table if not exists public.learning_progress (
 user_id uuid primary key references auth.users(id) on delete cascade,
 state jsonb not null,
 updated_at timestamptz not null default now(),
 constraint valid_state check (jsonb_typeof(state) = 'object' and state->>'version' = '1')
);
alter table public.learning_progress enable row level security;
revoke all on public.learning_progress from anon;
grant select, insert, update, delete on public.learning_progress to authenticated;
create policy "Read own learning progress" on public.learning_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own learning progress" on public.learning_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own learning progress" on public.learning_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own learning progress" on public.learning_progress for delete to authenticated using ((select auth.uid()) = user_id);
create or replace function public.set_progress_timestamp() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
create trigger progress_updated before update on public.learning_progress for each row execute function public.set_progress_timestamp();
