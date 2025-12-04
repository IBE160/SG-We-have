'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { startQuiz, submitAnswer, QuizStartResponse, QuizSubmissionResponse } from '../../../lib/services/quiz';
import { QuizQuestionDisplay } from '../../../components/QuizQuestionDisplay';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.quizId as string;

  const [quizState, setQuizState] = useState<QuizStartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (quizId) {
      startQuiz(quizId)
        .then((data) => {
          setQuizState(data);
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
    if (!quizState || isSubmitting || submissionResult) return;
    
    setSelectedOptionId(optionId);
    setIsSubmitting(true);

    try {
      const result = await submitAnswer(quizId, {
        attempt_id: quizState.attempt_id,
        question_id: quizState.first_question.id,
        answer_id: optionId
      });
      setSubmissionResult(result);
    } catch (err) {
      console.error('Failed to submit answer:', err);
      // Ideally show a toast notification here
      alert('Failed to submit answer. Please try again.');
      setSelectedOptionId(null); // Reset selection on error
    } finally {
      setIsSubmitting(false);
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

  if (!quizState) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-3xl">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{quizState.quiz_title}</h1>
          <span className="text-sm text-gray-500">
            Question {quizState.current_question_index + 1} of {quizState.total_questions}
          </span>
        </div>

        <QuizQuestionDisplay 
          question={quizState.first_question}
          onAnswerSelect={handleAnswerSelect}
          selectedOptionId={selectedOptionId}
          isAnswered={!!submissionResult}
          submissionResult={submissionResult}
        />

        <div className="mt-8 flex justify-end">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => alert('Next question implementation coming in next story')}
            disabled={!submissionResult}
          >
            Next Question
          </button>
        </div>
      </div>
    </main>
  );
}
