create table if not exists public.lectures (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lectures enable row level security;

create policy "Users can view lectures of their own courses"
  on public.lectures for select
  using (
    exists (
      select 1 from public.courses
      where courses.id = public.lectures.course_id
      and courses.user_id = auth.uid()
    )
  );

create policy "Users can insert lectures to their own courses"
  on public.lectures for insert
  with check (
    exists (
      select 1 from public.courses
      where courses.id = course_id
      and courses.user_id = auth.uid()
    )
  );

create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  lecture_id uuid references public.lectures(id) on delete cascade not null unique,
  content text not null default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notes enable row level security;

create policy "Users can view notes of their own lectures"
  on public.notes for select
  using (
    exists (
      select 1 from public.lectures
      join public.courses on courses.id = lectures.course_id
      where lectures.id = public.notes.lecture_id
      and courses.user_id = auth.uid()
    )
  );

create policy "Users can insert/update notes of their own lectures"
  on public.notes for all
  using (
    exists (
      select 1 from public.lectures
      join public.courses on courses.id = lectures.course_id
      where lectures.id = public.notes.lecture_id
      and courses.user_id = auth.uid()
    )
  );
