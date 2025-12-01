create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;

create policy "Users can create their own courses"
  on public.courses for insert
  with check ( auth.uid() = user_id );

create policy "Users can view their own courses"
  on public.courses for select
  using ( auth.uid() = user_id );
