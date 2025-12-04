CREATE TABLE public.questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  quiz_id uuid,
  text text NOT NULL,
  correct_option_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT questions_pkey PRIMARY KEY (id),
  CONSTRAINT questions_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id),
  CONSTRAINT fk_correct_option FOREIGN KEY (correct_option_id) REFERENCES public.options(id)
);