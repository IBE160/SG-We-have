'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../components/SupabaseClientProvider';
import { fetchNextQuestion, getQuizResults, retakeQuiz, submitAnswer, QuizStartResponse, QuizSubmissionResponse, QuestionDisplay, QuizResultResponse } from '../../../lib/services/quiz';
import { QuizQuestionDisplay } from '../../../components/QuizQuestionDisplay';
import { QuizProgressBar } from '../../../components/QuizProgressBar';
import { ScoreCard } from '../../../components/ScoreCard';

type AnswersState = {
  [questionId: string]: {
    is_correct: boolean;
    correct_answer_id: string;
    feedback_text: string;
    selected_option_id: string;
  }
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.quizId as string;
  const { isLoading: isAuthLoading } = useAuth();

  const [quizState, setQuizState] = useState<QuizStartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [questionsCache, setQuestionsCache] = useState<QuestionDisplay[]>([]);
  const [answers, setAnswers] = useState<AnswersState>({});

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResultResponse | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (quizId && !isAuthLoading) {
      const initializeQuiz = async () => {
        try {
          const data = await retakeQuiz(quizId);
          setQuizState(data);

          const allQuestions: QuestionDisplay[] = [data.first_question];
          let currentAttemptId = data.attempt_id;

          for (let i = 1; i < data.total_questions; i++) {
            const nextQuestionData = await fetchNextQuestion(quizId, { attempt_id: currentAttemptId });
            if (nextQuestionData.next_question) {
              allQuestions.push(nextQuestionData.next_question);
            }
          }
          
          setQuestionsCache(allQuestions);
          setCurrentQuestionIndex(0);
          setLoading(false);
        } catch (err) {
          console.error('Failed to initialize quiz:', err);
          setError('Failed to load quiz. Please try again.');
          setLoading(false);
        }
      };
      
      initializeQuiz();
    }
  }, [quizId, isAuthLoading]);

  const handleAnswerSelect = async (optionId: string) => {
    const currentQuestion = questionsCache[currentQuestionIndex];
    if (!quizState || !currentQuestion || isSubmitting || answers[currentQuestion.id]) return;
    
    setIsSubmitting(true);
    try {
      const result = await submitAnswer(quizId, {
        attempt_id: quizState.attempt_id,
        question_id: currentQuestion.id,
        answer_id: optionId
      });
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: { ...result, selected_option_id: optionId } }));
    } catch (err) {
      console.error('Failed to submit answer:', err);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsCache.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const score = Object.values(answers).filter(a => a.is_correct).length;
      setQuizResults({
          score: score,
          total_questions: questionsCache.length,
          percentage: (score / questionsCache.length) * 100,
          completed_at: new Date().toISOString(),
      });
      setIsComplete(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRetake = async () => {
      if (!quizId) return;
      setLoading(true);
      setError(null);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setIsComplete(false);
      setQuizResults(null);

      const initializeQuiz = async () => {
        try {
          const data = await retakeQuiz(quizId);
          setQuizState(data);

          const allQuestions: QuestionDisplay[] = [data.first_question];
           let currentAttemptId = data.attempt_id;
          
          for (let i = 1; i < data.total_questions; i++) {
            const nextQuestionData = await fetchNextQuestion(quizId, { attempt_id: currentAttemptId });
            if (nextQuestionData.next_question) {
              allQuestions.push(nextQuestionData.next_question);
            }
          }
          
          setQuestionsCache(allQuestions);
          setCurrentQuestionIndex(0);
          setLoading(false);
        } catch (err) {
          console.error('Failed to initialize quiz:', err);
          setError('Failed to load quiz. Please try again.');
          setLoading(false);
        }
      };
      
      initializeQuiz();
  };

  const handleNewQuiz = () => {
      router.push('/quiz');
  };

  const handleBackToCourses = () => {
      router.push('/dashboard');
  };

  if (loading || isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col bg-background-light">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-accent-blue text-white rounded hover:bg-accent-blue/90"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isComplete && quizResults) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background-light">
            <ScoreCard 
                results={quizResults}
                onRetake={handleRetake}
                onNewQuiz={handleNewQuiz}
                onBackToCourses={handleBackToCourses}
            />
        </div>
      );
  }

  const currentQuestion = questionsCache[currentQuestionIndex];
  const submissionResult = answers[currentQuestion?.id];
  const selectedOptionId = submissionResult?.selected_option_id;

  if (!quizState || !currentQuestion) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:pt-12 bg-background-light text-text-primary">
      <div className="w-full max-w-7xl">
        <div className="mb-6">
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 text-lg font-medium"
          >
            <span className="material-symbols-outlined" style={{fontSize: '24px'}}>arrow_back</span>
            Exit Quiz
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4 text-text-primary">{quizState.quiz_title}</h1>
          <QuizProgressBar 
            currentQuestionIndex={currentQuestionIndex} 
            totalQuestions={questionsCache.length} 
          />
        </div>

        <QuizQuestionDisplay 
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswerSelect={handleAnswerSelect}
          selectedOptionId={selectedOptionId}
          isAnswered={!!submissionResult}
          submissionResult={submissionResult}
          isLoading={isSubmitting}
        />

        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            className="px-6 py-3 bg-card border border-border-light text-text-primary rounded-lg font-medium hover:bg-sidebar-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            className="px-6 py-3 bg-accent-blue text-white rounded-lg font-medium hover:bg-accent-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            onClick={handleNextQuestion}
            disabled={!submissionResult}
          >
            {currentQuestionIndex + 1 === questionsCache.length ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </main>
  );
}