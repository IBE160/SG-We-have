"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Quiz } from '@/lib/types';

export default function QuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (quizId) {
      const fetchQuiz = async () => {
        const res = await fetch(`/api/quizzes/${quizId}`);
        const data = await res.json();
        setQuiz(data);
      };
      fetchQuiz();
    }
  }, [quizId]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const handleOptionChange = (questionId: string, optionId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId,
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getScore = () => {
    return quiz.questions.reduce((score, question) => {
      return score + (selectedAnswers[question.id] === question.correctOptionId ? 1 : 0);
    }, 0);
  };

  return (
    <div className="mockup-body">
      <main className="mockup-main">
        <div className="mockup-page-header">
          <Link href="/quiz">
            <button className="mockup-button">&larr; Back to Quizzes</button>
          </Link>
          <h1>{quiz.title}</h1>
          <p className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className="quiz-container">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="question-card" style={{ display: index === currentQuestionIndex ? 'block' : 'none' }}>
              <h3 className="question-text">{index + 1}. {question.text}</h3>
              <div className="options-container">
                {question.options.map(option => (
                  <div key={option.id} className="option">
                    <input
                      type="radio"
                      id={`${question.id}-${option.id}`}
                      name={question.id}
                      value={option.id}
                      onChange={() => handleOptionChange(question.id, option.id)}
                      disabled={submitted}
                    />
                    <label htmlFor={`${question.id}-${option.id}`}>{option.text}</label>
                  </div>
                ))}
              </div>
              {submitted && (
                <div className={`feedback ${selectedAnswers[question.id] === question.correctOptionId ? 'correct' : 'incorrect'}`}>
                  {selectedAnswers[question.id] === question.correctOptionId ? 'Correct!' : `Incorrect. The correct answer is ${question.options.find(o => o.id === question.correctOptionId)?.text}`}
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-between mt-4">
            {currentQuestionIndex > 0 && (
              <button className="mockup-button mockup-button-outline" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>Previous</button>
            )}
            {currentQuestionIndex < quiz.questions.length - 1 && !submitted && (
              <button className="mockup-button mockup-button-primary ml-auto" onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>Next</button>
            )}
          </div>
          {!submitted && currentQuestionIndex === quiz.questions.length - 1 ? (
            <button className="mockup-button mockup-button-primary mt-4 w-full" onClick={handleSubmit}>Submit Quiz</button>
          ) : null}
          {submitted && (
            <div className="score-container mt-4">
              <h2>Your Score: {getScore()} / {quiz.questions.length}</h2>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
