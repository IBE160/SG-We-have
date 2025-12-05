import React from 'react';

interface QuizProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

export function QuizProgressBar({ currentQuestionIndex, totalQuestions }: QuizProgressBarProps) {
  // currentQuestionIndex is 0-based.
  // Display should be 1-based.
  const current = currentQuestionIndex + 1;
  const percentage = Math.min(100, Math.max(0, (current / totalQuestions) * 100));

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-2 text-sm font-bold text-text-primary">
        <span>Question {current} of {totalQuestions}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-accent-blue h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  );
}
