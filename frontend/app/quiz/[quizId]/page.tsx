'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { startQuiz, submitAnswer, fetchNextQuestion, QuizStartResponse, QuizSubmissionResponse, QuestionDisplay } from '../../../lib/services/quiz';
import { QuizQuestionDisplay } from '../../../components/QuizQuestionDisplay';
import { QuizProgressBar } from '../../../components/QuizProgressBar';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.quizId as string;

  const [quizState, setQuizState] = useState<QuizStartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Current Question State
  const [currentQuestion, setCurrentQuestion] = useState<QuestionDisplay | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (quizId) {
      startQuiz(quizId)
        .then((data) => {
          setQuizState(data);
          setCurrentQuestion(data.first_question);
          setCurrentQuestionIndex(data.current_question_index);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to start quiz:', err);
          setError(err.message || 'Failed to load quiz');
          setLoading(false);
        });
    }
  }, [quizId]);

  const handleAnswerSelect = async (optionId: string) => {
    if (!quizState || !currentQuestion || isSubmitting || submissionResult) return;
    
    setSelectedOptionId(optionId);
    setIsSubmitting(true);

    try {
      const result = await submitAnswer(quizId, {
        attempt_id: quizState.attempt_id,
        question_id: currentQuestion.id,
        answer_id: optionId
      });
      setSubmissionResult(result);
    } catch (err) {
      console.error('Failed to submit answer:', err);
      alert('Failed to submit answer. Please try again.');
      setSelectedOptionId(null); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!quizState) return;
    
    try {
      const nextData = await fetchNextQuestion(quizId, { attempt_id: quizState.attempt_id });
      
      if (nextData.is_complete) {
        setIsComplete(true);
      } else if (nextData.next_question) {
        setCurrentQuestion(nextData.next_question);
        setCurrentQuestionIndex(nextData.current_question_index);
        // Reset for next question
        setSelectedOptionId(null);
        setSubmissionResult(null);
      }
    } catch (err) {
      console.error('Failed to fetch next question:', err);
      alert('Failed to load next question.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isComplete) {
      return (
        <div className="flex min-h-screen items-center justify-center flex-col bg-gray-50 dark:bg-gray-900">
            <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
            <p className="mb-6">You have finished the quiz.</p>
            <button 
            onClick={() => router.push(`/courses`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
            Back to Courses
            </button>
        </div>
      );
  }

  if (!quizState || !currentQuestion) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">{quizState.quiz_title}</h1>
          <QuizProgressBar 
            currentQuestionIndex={currentQuestionIndex} 
            totalQuestions={quizState.total_questions} 
          />
        </div>

        <QuizQuestionDisplay 
          question={currentQuestion}
          onAnswerSelect={handleAnswerSelect}
          selectedOptionId={selectedOptionId}
          isAnswered={!!submissionResult}
          submissionResult={submissionResult}
        />

        <div className="mt-8 flex justify-end">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNextQuestion}
            disabled={!submissionResult}
          >
            Next Question
          </button>
        </div>
      </div>
    </main>
  );
}