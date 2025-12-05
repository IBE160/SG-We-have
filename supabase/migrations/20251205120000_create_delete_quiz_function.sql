CREATE OR REPLACE FUNCTION delete_quiz(quiz_id_to_delete UUID)
RETURNS VOID AS $$
BEGIN
    -- Delete answers for attempts related to the quiz
    DELETE FROM quiz_answers WHERE attempt_id IN (SELECT id FROM quiz_attempts WHERE quiz_id = quiz_id_to_delete);

    -- Delete options for questions related to the quiz
    DELETE FROM quiz_options WHERE question_id IN (SELECT id FROM quiz_questions WHERE quiz_id = quiz_id_to_delete);
    
    -- Delete questions related to the quiz
    DELETE FROM quiz_questions WHERE quiz_id = quiz_id_to_delete;
    
    -- Delete attempts for the quiz
    DELETE FROM quiz_attempts WHERE quiz_id = quiz_id_to_delete;

    -- Delete the quiz itself
    DELETE FROM quizzes WHERE id = quiz_id_to_delete;
END;
$$ LANGUAGE plpgsql;
