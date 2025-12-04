CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  lectures integer,
  last_updated timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid,
  CONSTRAINT courses_pkey PRIMARY KEY (id),
  CONSTRAINT courses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);