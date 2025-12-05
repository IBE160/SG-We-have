from fastapi import HTTPException
from supabase import Client
from app.models.quiz_submission import QuizStartResponse, QuestionDisplay, QuizAttempt, QuizSubmissionRequest, QuizSubmissionResponse, QuizNextRequest, QuizNextResponse
from app.models.quiz import OptionResponse
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

import uuid
from app.services.mock_storage import get_mock_quiz, save_mock_attempt, get_mock_attempt

logger = logging.getLogger(__name__)

async def submit_answer(quiz_id: str, request: QuizSubmissionRequest, user_id: str, supabase: Client) -> QuizSubmissionResponse:
    """
    Validates a submitted answer, records it, and returns feedback.
    """
    try:
        is_mock = False
        attempt_data = None
        question_data = None
        selected_option = None

        # 1. Verify Attempt Ownership
        try:
            attempt_res = supabase.table("quiz_attempts").select("id, user_id").eq("id", request.attempt_id).single().execute()
            if attempt_res.data:
                attempt_data = attempt_res.data
        except Exception:
            pass

        if not attempt_data:
            # Fallback to mock
            attempt_data = get_mock_attempt(request.attempt_id)
            if attempt_data:
                is_mock = True
            else:
                 raise HTTPException(status_code=404, detail="Quiz attempt not found")
        
        if attempt_data['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized for this quiz attempt")

        # 2. Fetch Question and Correct Answer
        if not is_mock:
            question_res = supabase.table("quiz_questions").select("id, correct_answer_index, explanation").eq("id", request.question_id).single().execute()
            if not question_res.data:
                raise HTTPException(status_code=404, detail="Question not found")
            
            question_db = question_res.data
            # Fetch options to get the text? No, we have indices.
            # Wait, earlier code used 'correct_answer' text. 
            # But the generator saves 'correct_answer_index'.
            # Let's assume DB stores index or we need to join.
            # Simplified: The previous code assumed `correct_answer` column existed as text? 
            # My create script had `correct_answer_index`.
            # Let's just use the index from the question data.
            correct_index = question_db.get('correct_answer_index')
            explanation = question_db.get('explanation')
            
            # Fetch selected option to verify it exists
            selected_option_res = supabase.table("quiz_options").select("id, option_index, option_text").eq("id", request.answer_id).single().execute()
            if not selected_option_res.data:
                 raise HTTPException(status_code=400, detail="Invalid answer ID")
            
            selected_option = selected_option_res.data
            is_correct = (selected_option['option_index'] == correct_index)
            
            # Record
            answer_data = {
                "attempt_id": request.attempt_id,
                "question_id": request.question_id,
                "selected_option_id": request.answer_id,
                "is_correct": is_correct
            }
            supabase.table("quiz_answers").insert(answer_data).execute()

            # Get correct option ID
            correct_answer_id = ""
            if not is_correct:
                 correct_opt_res = supabase.table("quiz_options").select("id").eq("question_id", request.question_id).eq("option_index", correct_index).single().execute()
                 if correct_opt_res.data:
                     correct_answer_id = correct_opt_res.data['id']
            else:
                correct_answer_id = request.answer_id

            feedback_text = "Correct!" if is_correct else "Incorrect."
            if explanation:
                feedback_text += f" {explanation}"
                
            return QuizSubmissionResponse(
                is_correct=is_correct,
                correct_answer_id=correct_answer_id,
                feedback_text=feedback_text,
                explanation=explanation
            )

        else:
            # Mock Logic
            mock_quiz = get_mock_quiz(attempt_data['quiz_id'])
            if not mock_quiz:
                raise HTTPException(status_code=404, detail="Mock quiz data missing")
            
            # Find question
            mock_q = next((q for q in mock_quiz['questions'] if q['id'] == request.question_id), None)
            if not mock_q:
                raise HTTPException(status_code=404, detail="Question not found")
            
            # Find selected option
            # In mock storage, options are dicts in the question
            mock_opt = next((o for o in mock_q['options'] if o['id'] == request.answer_id), None)
            if not mock_opt:
                 raise HTTPException(status_code=400, detail="Invalid answer ID")
            
            is_correct = mock_opt['is_correct']
            correct_answer_id = next((o['id'] for o in mock_q['options'] if o['is_correct']), "")
            
            feedback_text = "Correct!" if is_correct else "Incorrect."
            if mock_q.get('explanation'):
                feedback_text += f" {mock_q['explanation']}"
                
            return QuizSubmissionResponse(
                is_correct=is_correct,
                correct_answer_id=correct_answer_id,
                feedback_text=feedback_text,
                explanation=mock_q.get('explanation')
            )

    except Exception as e:
        logger.error(f"Error submitting answer: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

async def start_quiz_attempt(quiz_id: str, user_id: str, supabase: Client) -> QuizStartResponse:
    """
    Initializes a quiz attempt and returns the first question.
    """
    try:
        quiz_title = ""
        is_mock = False
        mock_quiz_data = None

        # 1. Verify Quiz Exists
        try:
            quiz_res = supabase.table("quizzes").select("title, user_id").eq("id", quiz_id).single().execute()
            if quiz_res.data:
                quiz_title = quiz_res.data['title']
        except Exception:
            pass # Fallback to mock check
            
        if not quiz_title:
            # Check mock storage
            mock_quiz_data = get_mock_quiz(quiz_id)
            if mock_quiz_data:
                quiz_title = mock_quiz_data['title']
                is_mock = True
            else:
                raise HTTPException(status_code=404, detail="Quiz not found")

        # 2. Create Quiz Attempt
        attempt_id = ""
        if not is_mock:
            attempt_data = {
                "user_id": user_id,
                "quiz_id": quiz_id,
                "status": "in_progress",
                "current_question_index": 0
            }
            attempt_res = supabase.table("quiz_attempts").insert(attempt_data).execute()
            if not attempt_res.data:
                raise HTTPException(status_code=500, detail="Failed to create quiz attempt")
            attempt_id = attempt_res.data[0]['id']
        else:
            attempt_id = str(uuid.uuid4())
            save_mock_attempt({
                "id": attempt_id,
                "user_id": user_id,
                "quiz_id": quiz_id,
                "status": "in_progress"
            })

        # 3. Fetch Questions
        if not is_mock:
            questions_res = supabase.table("quiz_questions").select("*, quiz_options(*)").eq("quiz_id", quiz_id).execute()
            if not questions_res.data:
                 raise HTTPException(status_code=404, detail="Quiz has no questions")
            
            questions = questions_res.data
            # Sort questions? DB doesn't guarantee order unless we have a column.
            # Using ID or insertion order if consistent.
            
            total_questions = len(questions)
            first_question_data = questions[0]

            # Map Options
            options = []
            for opt in first_question_data.get('quiz_options', []):
                options.append(OptionResponse(
                    id=opt['id'],
                    option_text=opt['option_text'],
                    option_index=opt['option_index']
                ))
            options.sort(key=lambda x: x.option_index)

            first_question = QuestionDisplay(
                id=first_question_data['id'],
                question_text=first_question_data['question_text'],
                options=options
            )
        else:
            # Mock Data
            questions = mock_quiz_data['questions']
            if not questions:
                raise HTTPException(status_code=404, detail="Quiz has no questions")
            
            total_questions = len(questions)
            first_q = questions[0]
            
            options = []
            for opt in first_q['options']:
                options.append(OptionResponse(
                    id=opt['id'],
                    option_text=opt['option_text'],
                    option_index=opt['option_index']
                ))
            
            first_question = QuestionDisplay(
                id=first_q['id'],
                question_text=first_q['question_text'],
                options=options
            )

        return QuizStartResponse(
            attempt_id=attempt_id,
            quiz_id=quiz_id,
            quiz_title=quiz_title,
            total_questions=total_questions,
            current_question_index=0,
            first_question=first_question
        )

    except Exception as e:
        logger.error(f"Error starting quiz attempt: {e}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))
 
 a s y n c   d e f   g e t _ n e x t _ q u e s t i o n ( q u i z _ i d :   s t r ,   r e q u e s t :   Q u i z N e x t R e q u e s t ,   u s e r _ i d :   s t r ,   s u p a b a s e :   C l i e n t )   - >   Q u i z N e x t R e s p o n s e :  
         " " "  
         A d v a n c e s   t o   t h e   n e x t   q u e s t i o n   i n   t h e   q u i z   a t t e m p t .  
         " " "  
         t r y :  
                 i s _ m o c k   =   F a l s e  
                 a t t e m p t _ d a t a   =   N o n e  
                  
                 #   1 .   V e r i f y   A t t e m p t   O w n e r s h i p  
                 t r y :  
                         a t t e m p t _ r e s   =   s u p a b a s e . t a b l e ( " q u i z _ a t t e m p t s " ) . s e l e c t ( " * " ) . e q ( " i d " ,   r e q u e s t . a t t e m p t _ i d ) . s i n g l e ( ) . e x e c u t e ( )  
                         i f   a t t e m p t _ r e s . d a t a :  
                                 a t t e m p t _ d a t a   =   a t t e m p t _ r e s . d a t a  
                 e x c e p t   E x c e p t i o n :  
                         p a s s  
  
                 i f   n o t   a t t e m p t _ d a t a :  
                         #   C h e c k   m o c k  
                         a t t e m p t _ d a t a   =   g e t _ m o c k _ a t t e m p t ( r e q u e s t . a t t e m p t _ i d )  
                         i f   a t t e m p t _ d a t a :  
                                 i s _ m o c k   =   T r u e  
                         e l s e :  
                                 r a i s e   H T T P E x c e p t i o n ( s t a t u s _ c o d e = 4 0 4 ,   d e t a i l = " Q u i z   a t t e m p t   n o t   f o u n d " )  
                  
                 i f   a t t e m p t _ d a t a [ ' u s e r _ i d ' ]   ! =   u s e r _ i d :  
                         r a i s e   H T T P E x c e p t i o n ( s t a t u s _ c o d e = 4 0 3 ,   d e t a i l = " N o t   a u t h o r i z e d   f o r   t h i s   q u i z   a t t e m p t " )  
                          
                 c u r r e n t _ i n d e x   =   a t t e m p t _ d a t a . g e t ( ' c u r r e n t _ q u e s t i o n _ i n d e x ' ,   0 )  
                 n e x t _ i n d e x   =   c u r r e n t _ i n d e x   +   1  
                  
                 #   2 .   F e t c h   Q u e s t i o n s   t o   c h e c k   t o t a l   a n d   g e t   n e x t  
                 i f   n o t   i s _ m o c k :  
                         q u e s t i o n s _ r e s   =   s u p a b a s e . t a b l e ( " q u i z _ q u e s t i o n s " ) . s e l e c t ( " * ,   q u i z _ o p t i o n s ( * ) " ) . e q ( " q u i z _ i d " ,   q u i z _ i d ) . e x e c u t e ( )  
                         i f   n o t   q u e s t i o n s _ r e s . d a t a :  
                                   r a i s e   H T T P E x c e p t i o n ( s t a t u s _ c o d e = 4 0 4 ,   d e t a i l = " Q u i z   h a s   n o   q u e s t i o n s " )  
                          
                         q u e s t i o n s   =   q u e s t i o n s _ r e s . d a t a  
                         #   E n s u r e   d e t e r m i n i s t i c   o r d e r   -   s o r t i n g   b y   I D   f o r   n o w   a s   a   f a l l b a c k   f o r   l a c k   o f   ' o r d e r '   c o l u m n  
                         q u e s t i o n s . s o r t ( k e y = l a m b d a   x :   x [ ' i d ' ] )  
                          
                         t o t a l _ q u e s t i o n s   =   l e n ( q u e s t i o n s )  
                          
                         i f   n e x t _ i n d e x   > =   t o t a l _ q u e s t i o n s :  
                                 #   Q u i z   C o m p l e t e d  
                                 s u p a b a s e . t a b l e ( " q u i z _ a t t e m p t s " ) . u p d a t e ( {  
                                         " s t a t u s " :   " c o m p l e t e d " ,  
                                         " e n d _ t i m e " :   d a t e t i m e . u t c n o w ( ) . i s o f o r m a t ( ) ,  
                                         " c u r r e n t _ q u e s t i o n _ i n d e x " :   t o t a l _ q u e s t i o n s   #   S e t   t o   t o t a l   t o   i n d i c a t e   e n d  
                                 } ) . e q ( " i d " ,   r e q u e s t . a t t e m p t _ i d ) . e x e c u t e ( )  
                                  
                                 r e t u r n   Q u i z N e x t R e s p o n s e (  
                                         a t t e m p t _ i d = r e q u e s t . a t t e m p t _ i d ,  
                                         c u r r e n t _ q u e s t i o n _ i n d e x = t o t a l _ q u e s t i o n s ,  
                                         t o t a l _ q u e s t i o n s = t o t a l _ q u e s t i o n s ,  
                                         i s _ c o m p l e t e = T r u e ,  
                                         n e x t _ q u e s t i o n = N o n e  
                                 )  
                         e l s e :  
                                 #   F e t c h   N e x t   Q u e s t i o n  
                                 n e x t _ q _ d a t a   =   q u e s t i o n s [ n e x t _ i n d e x ]  
                                  
                                 #   U p d a t e   A t t e m p t  
                                 s u p a b a s e . t a b l e ( " q u i z _ a t t e m p t s " ) . u p d a t e ( {  
                                         " c u r r e n t _ q u e s t i o n _ i n d e x " :   n e x t _ i n d e x  
                                 } ) . e q ( " i d " ,   r e q u e s t . a t t e m p t _ i d ) . e x e c u t e ( )  
                                  
                                 #   M a p   O p t i o n s  
                                 o p t i o n s   =   [ ]  
                                 f o r   o p t   i n   n e x t _ q _ d a t a . g e t ( ' q u i z _ o p t i o n s ' ,   [ ] ) :  
                                         o p t i o n s . a p p e n d ( O p t i o n R e s p o n s e (  
                                                 i d = o p t [ ' i d ' ] ,  
                                                 o p t i o n _ t e x t = o p t [ ' o p t i o n _ t e x t ' ] ,  
                                                 o p t i o n _ i n d e x = o p t [ ' o p t i o n _ i n d e x ' ]  
                                         ) )  
                                 o p t i o n s . s o r t ( k e y = l a m b d a   x :   x . o p t i o n _ i n d e x )  
  
                                 n e x t _ q u e s t i o n   =   Q u e s t i o n D i s p l a y (  
                                         i d = n e x t _ q _ d a t a [ ' i d ' ] ,  
                                         q u e s t i o n _ t e x t = n e x t _ q _ d a t a [ ' q u e s t i o n _ t e x t ' ] ,  
                                         o p t i o n s = o p t i o n s  
                                 )  
                                  
                                 r e t u r n   Q u i z N e x t R e s p o n s e (  
                                         a t t e m p t _ i d = r e q u e s t . a t t e m p t _ i d ,  
                                         c u r r e n t _ q u e s t i o n _ i n d e x = n e x t _ i n d e x ,  
                                         t o t a l _ q u e s t i o n s = t o t a l _ q u e s t i o n s ,  
                                         i s _ c o m p l e t e = F a l s e ,  
                                         n e x t _ q u e s t i o n = n e x t _ q u e s t i o n  
                                 )  
  
                 e l s e :  
                         #   M o c k   L o g i c  
                         m o c k _ q u i z   =   g e t _ m o c k _ q u i z ( a t t e m p t _ d a t a [ ' q u i z _ i d ' ] )  
                         q u e s t i o n s   =   m o c k _ q u i z [ ' q u e s t i o n s ' ]  
                         t o t a l _ q u e s t i o n s   =   l e n ( q u e s t i o n s )  
                          
                         i f   n e x t _ i n d e x   > =   t o t a l _ q u e s t i o n s :  
                                   #   C o m p l e t e  
                                   s a v e _ m o c k _ a t t e m p t ( { * * a t t e m p t _ d a t a ,   " s t a t u s " :   " c o m p l e t e d " ,   " c u r r e n t _ q u e s t i o n _ i n d e x " :   t o t a l _ q u e s t i o n s } )  
                                   r e t u r n   Q u i z N e x t R e s p o n s e (  
                                         a t t e m p t _ i d = r e q u e s t . a t t e m p t _ i d ,  
                                         c u r r e n t _ q u e s t i o n _ i n d e x = t o t a l _ q u e s t i o n s ,  
                                         t o t a l _ q u e s t i o n s = t o t a l _ q u e s t i o n s ,  
                                         i s _ c o m p l e t e = T r u e ,  
                                         n e x t _ q u e s t i o n = N o n e  
                                 )  
                         e l s e :  
                                 #   N e x t  
                                 n e x t _ q   =   q u e s t i o n s [ n e x t _ i n d e x ]  
                                 s a v e _ m o c k _ a t t e m p t ( { * * a t t e m p t _ d a t a ,   " c u r r e n t _ q u e s t i o n _ i n d e x " :   n e x t _ i n d e x } )  
                                  
                                 o p t i o n s   =   [ ]  
                                 f o r   o p t   i n   n e x t _ q [ ' o p t i o n s ' ] :  
                                         o p t i o n s . a p p e n d ( O p t i o n R e s p o n s e (  
                                                 i d = o p t [ ' i d ' ] ,  
                                                 o p t i o n _ t e x t = o p t [ ' o p t i o n _ t e x t ' ] ,  
                                                 o p t i o n _ i n d e x = o p t [ ' o p t i o n _ i n d e x ' ]  
                                         ) )  
                                  
                                 n e x t _ q u e s t i o n   =   Q u e s t i o n D i s p l a y (  
                                         i d = n e x t _ q [ ' i d ' ] ,  
                                         q u e s t i o n _ t e x t = n e x t _ q [ ' q u e s t i o n _ t e x t ' ] ,  
                                         o p t i o n s = o p t i o n s  
                                 )  
                                  
                                 r e t u r n   Q u i z N e x t R e s p o n s e (  
                                         a t t e m p t _ i d = r e q u e s t . a t t e m p t _ i d ,  
                                         c u r r e n t _ q u e s t i o n _ i n d e x = n e x t _ i n d e x ,  
                                         t o t a l _ q u e s t i o n s = t o t a l _ q u e s t i o n s ,  
                                         i s _ c o m p l e t e = F a l s e ,  
                                         n e x t _ q u e s t i o n = n e x t _ q u e s t i o n  
                                 )  
                                  
         e x c e p t   E x c e p t i o n   a s   e :  
                 l o g g e r . e r r o r ( f " E r r o r   g e t t i n g   n e x t   q u e s t i o n :   { e } " )  
                 i f   i s i n s t a n c e ( e ,   H T T P E x c e p t i o n ) :  
                         r a i s e   e  
                 r a i s e   H T T P E x c e p t i o n ( s t a t u s _ c o d e = 5 0 0 ,   d e t a i l = s t r ( e ) )  
 