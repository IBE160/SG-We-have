# Story 1-1: User Registration

**Epic:** 1 - User Foundation & Course Management
**Story ID:** 1-1
**Status:** Ready for Dev

## 1. User Story
**As a** new student
**I want to** create an account
**So that** I can access the application's features and save my data.

## 2. Goal
Enable users to sign up for the application using their email and password. This is the entry point for the user journey and a prerequisite for all other personal features (courses, notes, quizzes).

## 3. Acceptance Criteria
- [ ] **Registration Form:** A dedicated registration page (`/register`) exists.
- [ ] **Input Fields:** Users can enter Email and Password.
- [ ] **Validation:**
    - Email must be valid.
    - Password must be at least 6 characters (Supabase default).
    - Form shows clear error messages for invalid input.
- [ ] **Submission:** Submitting the form creates a user in Supabase Auth.
- [ ] **Profile Creation:** A corresponding row is created in the `profiles` table (via Database Trigger).
- [ ] **Success State:** Upon successful registration, the user is automatically logged in and redirected to the Dashboard (`/dashboard`).
- [ ] **Error Handling:** If registration fails (e.g., user already exists), a user-friendly error message is displayed.
- [ ] **Navigation:** Link to "Login" page is available for existing users.

## 4. Technical Implementation

### 4.1. Database (Supabase)
*   **Task:** Create `profiles` table and set up a Trigger for new user creation.
*   **SQL Script:**
    ```sql
    -- Create a table for public profiles
    create table if not exists profiles (
      id uuid references auth.users on delete cascade not null primary key,
      updated_at timestamp with time zone,
      username text unique,
      full_name text,
      avatar_url text,
      website text,

      constraint username_length check (char_length(username) >= 3)
    );
    
    -- Set up Row Level Security (RLS)
    alter table profiles enable row level security;

    create policy "Public profiles are viewable by everyone." on profiles
      for select using (true);

    create policy "Users can insert their own profile." on profiles
      for insert with check (auth.uid() = id);

    create policy "Users can update own profile." on profiles
      for update using (auth.uid() = id);

    -- Trigger to create profile on signup
    create or replace function public.handle_new_user()
    returns trigger as $$
    begin
      insert into public.profiles (id, full_name, avatar_url)
      values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
      return new;
    end;
    $$ language plpgsql security definer;

    drop trigger if exists on_auth_user_created on auth.users;
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
    ```

### 4.2. Frontend (Next.js)
*   **Page:** `frontend/app/register/page.tsx` (New file).
*   **Components:** Use standard HTML/Tailwind forms.
*   **Logic:**
    - Use Supabase Client (`lib/supabase.ts`).
    - Call `supabase.auth.signUp({ email, password })`.
    - Handle response:
        - If error: Display `error.message`.
        - If success: Router push to `/dashboard`.

### 4.3. Backend (FastAPI)
*   **No work required** for this story. Auth is handled client-side with Supabase.

## 5. Implementation Steps
1.  **Database:** Run the SQL script in the Supabase Dashboard (SQL Editor) to set up the `profiles` table and triggers.
2.  **Frontend:** Create the `RegisterPage` component with form state and validation.
3.  **Frontend:** Implement the `handleRegister` function using `supabase.auth.signUp`.
4.  **Frontend:** Add navigation links between Login and Register pages.
5.  **Verify:** Sign up a new user manually and check `auth.users` and `public.profiles` tables in Supabase.