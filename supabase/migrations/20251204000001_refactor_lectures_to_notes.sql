-- Migration to refactor lectures and notes into a single notes table
-- 1. Create the new table
create table if not exists public.new_notes (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  content text not null default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Migrate data (if old tables exist)
do $$
begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'lectures') then
    insert into public.new_notes (id, course_id, title, content, created_at)
    select 
      l.id, 
      l.course_id, 
      l.title, 
      coalesce(n.content, ''), 
      l.created_at
    from public.lectures l
    left join public.notes n on l.id = n.lecture_id;
  end if;
end
$$;

-- 3. Drop old tables
drop table if exists public.notes;
drop table if exists public.lectures;

-- 4. Rename new table to 'notes'
alter table public.new_notes rename to notes;

-- 5. Enable RLS
alter table public.notes enable row level security;

-- 6. Policies
create policy "Users can view notes of their own courses"
  on public.notes for select
  using (
    exists (
      select 1 from public.courses
      where courses.id = public.notes.course_id
      and courses.user_id = auth.uid()
    )
  );

create policy "Users can insert notes to their own courses"
  on public.notes for insert
  with check (
    exists (
      select 1 from public.courses
      where courses.id = course_id
      and courses.user_id = auth.uid()
    )
  );

create policy "Users can update their own notes"
  on public.notes for update
  using (
    exists (
      select 1 from public.courses
      where courses.id = public.notes.course_id
      and courses.user_id = auth.uid()
    )
  );

create policy "Users can delete their own notes"
  on public.notes for delete
  using (
    exists (
      select 1 from public.courses
      where courses.id = public.notes.course_id
      and courses.user_id = auth.uid()
    )
  );
