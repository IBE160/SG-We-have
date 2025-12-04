import React from 'react';
import { QuestionDisplay, QuizSubmissionResponse } from '../lib/services/quiz';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface QuizQuestionDisplayProps {
  question: QuestionDisplay;
  onAnswerSelect?: (optionId: string) => void;
  selectedOptionId?: string | null;
  isAnswered?: boolean;
  submissionResult?: QuizSubmissionResponse | null;
}

export const QuizQuestionDisplay: React.FC<QuizQuestionDisplayProps> = ({ 
  question, 
  onAnswerSelect,
  selectedOptionId,
  isAnswered = false,
  submissionResult
}) => {
  
  const getOptionClassName = (optionId: string) => {
    const isSelected = selectedOptionId === optionId;
    const isCorrect = submissionResult?.correct_answer_id === optionId;
    
    // Base styles
    let classes = "w-full text-left p-4 rounded-md border transition-colors ";
    
    if (isAnswered) {
      if (isCorrect) {
        // Correct answer (Green)
        classes += "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600";
      } else if (isSelected && !submissionResult?.is_correct) {
        // Wrong selection (Red)
        classes += "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600";
      } else {
        // Other options
        classes += "border-gray-200 dark:border-gray-700 opacity-50";
      }
    } else {
      // Interactive state
      if (isSelected) {
        classes += "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
      } else {
        classes += "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700";
      }
    }
    
    return twMerge(classes);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        {question.question_text}
      </h2>
      
      <div className="space-y-4">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => !isAnswered && onAnswerSelect?.(option.id)}
            disabled={isAnswered}
            className={getOptionClassName(option.id)}
          >
            <div className="flex items-center">
              <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium mr-3
                ${isAnswered && submissionResult?.correct_answer_id === option.id ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                  isAnswered && selectedOptionId === option.id && !submissionResult?.is_correct ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100' :
                  'bg-gray-100 dark:bg-gray-700'
                }
              `}>
                {String.fromCharCode(65 + option.option_index)}
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {option.option_text}
              </span>
            </div>
          </button>
        ))}
      </div>

      {isAnswered && submissionResult && (
        <div className={`mt-6 p-4 rounded-md ${submissionResult.is_correct ? 'bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-200'}`}>
          <p className="font-medium mb-1">
            {submissionResult.is_correct ? 'Correct!' : 'Incorrect'}
          </p>
          <p>{submissionResult.feedback_text}</p>
        </div>
      )}
    </div>
  );
};
