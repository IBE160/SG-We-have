import React from 'react';
import { QuestionDisplay } from '../lib/services/quiz';

interface QuizQuestionDisplayProps {
  question: QuestionDisplay;
  onAnswerSelect?: (optionId: string) => void;
  selectedOptionId?: string | null;
}

export const QuizQuestionDisplay: React.FC<QuizQuestionDisplayProps> = ({ 
  question, 
  onAnswerSelect,
  selectedOptionId 
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        {question.question_text}
      </h2>
      
      <div className="space-y-4">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswerSelect?.(option.id)}
            className={`w-full text-left p-4 rounded-md border transition-colors
              ${selectedOptionId === option.id 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }
            `}
          >
            <div className="flex items-center">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-medium mr-3">
                {String.fromCharCode(65 + option.option_index)}
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {option.option_text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
