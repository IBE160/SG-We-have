'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { startQuiz, submitAnswer, fetchNextQuestion, fetchPreviousQuestion, getQuizResults, retakeQuiz, QuizStartResponse, QuizSubmissionResponse, QuestionDisplay, QuizResultResponse } from '../../../lib/services/quiz';
import { QuizQuestionDisplay } from '../../../components/QuizQuestionDisplay';
import { QuizProgressBar } from '../../../components/QuizProgressBar';
import { ScoreCard } from '../../../components/ScoreCard';

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
  const [quizResults, setQuizResults] = useState<QuizResultResponse | null>(null);

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
        // Fetch results
        setLoading(true); // Show loading while fetching results
        try {
            const results = await getQuizResults(quizId, quizState.attempt_id);
            setQuizResults(results);
            setIsComplete(true);
        } catch (resErr: any) {
            console.error('Failed to fetch results:', resErr);
            setError('Failed to load quiz results. ' + (resErr.message || ''));
        } finally {
            setLoading(false);
        }
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

  const handlePreviousQuestion = async () => {
    if (!quizState || currentQuestionIndex <= 0) return;

    try {
      const prevData = await fetchPreviousQuestion(quizId, { attempt_id: quizState.attempt_id });
      
      setCurrentQuestion(prevData.previous_question);
      setCurrentQuestionIndex(prevData.current_question_index);
      
      // Restore state if answered
      if (prevData.existing_answer) {
          setSubmissionResult(prevData.existing_answer);
          setSelectedOptionId(prevData.selected_option_id || null);
      } else {
          setSubmissionResult(null);
          setSelectedOptionId(null);
      }

    } catch (err) {
      console.error('Failed to fetch previous question:', err);
      alert('Failed to load previous question.');
    }
  };

  const handleRetake = async () => {
      if (!quizState) return;
      setLoading(true);
      setError(null);
      try {
          const data = await retakeQuiz(quizId, quizState.attempt_id);
          setQuizState(data);
          setCurrentQuestion(data.first_question);
          setCurrentQuestionIndex(data.current_question_index);
          
          // Reset states
          setIsComplete(false);
          setQuizResults(null);
          setSelectedOptionId(null);
          setSubmissionResult(null);
          setIsSubmitting(false);
      } catch (err: any) {
          console.error('Failed to retake quiz:', err);
          setError(err.message || 'Failed to retake quiz');
      } finally {
          setLoading(false);
      }
  };

  const handleNewQuiz = () => {
      // Redirect to the quiz generation page
      router.push('/quiz');
  };

  const handleBackToCourses = () => {
      router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
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

  if (isComplete && quizResults) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
            <ScoreCard 
                results={quizResults}
                onRetake={handleRetake}
                onNewQuiz={handleNewQuiz}
                onBackToCourses={handleBackToCourses}
            />
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

        <div className="mt-8 flex justify-between">
          <button
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNextQuestion}
            disabled={!submissionResult}
          >
            {currentQuestionIndex + 1 === quizState.total_questions ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </main>
  );
}