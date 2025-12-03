-- System Prompts Table
CREATE TABLE system_prompts (
  key TEXT PRIMARY KEY,
  template TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default prompt
INSERT INTO system_prompts (key, template, description) VALUES (
  'quiz_generator_v1',
  'You are an expert educator. Generate a multiple-choice quiz based on the following notes.
  
  Notes:
  {{notes}}
  
  Instructions:
  1. Generate {{quiz_length}} questions.
  2. Focus on definitions, application, and comparison.
  3. Each question must have 4 options.
  4. Provide the correct answer index (0-3) and a brief explanation.
  5. Ensure questions are relevant, accurate, and pedagogical.
  
  Output Format: JSON matching the specified schema.',
  'Default prompt for generating quizzes from notes.'
);

-- Quizzes Table
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Assuming course_id might not always be single if we select multiple lectures from different courses? 
  -- But usually lectures belong to a course. Let's keep it simple.
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL, 
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Questions Table
CREATE TABLE quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  correct_answer_index INTEGER NOT NULL,
  explanation TEXT
);

-- Options Table
CREATE TABLE quiz_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  option_index INTEGER NOT NULL
);

-- RLS Policies
ALTER TABLE system_prompts ENABLE ROW LEVEL SECURITY;
-- Read only for authenticated users? Or just service role? 
-- Since the backend reads it using the service key usually (or user key), let's allow read for authenticated.
CREATE POLICY "Allow read access to system_prompts" ON system_prompts FOR SELECT TO authenticated USING (true);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own quizzes" ON quizzes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own quizzes" ON quizzes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own quizzes" ON quizzes FOR DELETE TO authenticated USING (auth.uid() = user_id);


ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view questions for their quizzes" ON quiz_questions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM quizzes WHERE quizzes.id = quiz_questions.quiz_id AND quizzes.user_id = auth.uid())
);
CREATE POLICY "Users can create questions for their quizzes" ON quiz_questions FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM quizzes WHERE quizzes.id = quiz_questions.quiz_id AND quizzes.user_id = auth.uid())
);

ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view options for their quizzes" ON quiz_options FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM quiz_questions JOIN quizzes ON quizzes.id = quiz_questions.quiz_id WHERE quiz_questions.id = quiz_options.question_id AND quizzes.user_id = auth.uid())
);
CREATE POLICY "Users can create options for their quizzes" ON quiz_options FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM quiz_questions JOIN quizzes ON quizzes.id = quiz_questions.quiz_id WHERE quiz_questions.id = quiz_options.question_id AND quizzes.user_id = auth.uid())
);
