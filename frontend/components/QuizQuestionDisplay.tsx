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
  isLoading?: boolean;
}

export const QuizQuestionDisplay: React.FC<QuizQuestionDisplayProps> = ({ 
  question, 
  onAnswerSelect,
  selectedOptionId,
  isAnswered = false,
  submissionResult,
  isLoading = false
}) => {
  
  const getOptionClassName = (optionId: string) => {
    const isSelected = selectedOptionId === optionId;
    const isCorrect = submissionResult?.correct_answer_id === optionId;
    
    // Base styles
    let classes = "w-full text-left p-4 rounded-md border transition-colors ";
    
    if (isAnswered) {
      if (isCorrect) {
        // Correct answer (Green)
        classes += "border-accent-green bg-accent-green/10";
      } else if (isSelected && !submissionResult?.is_correct) {
        // Wrong selection (Red)
        classes += "border-red-500 bg-red-500/10";
      } else {
        // Other options
        classes += "border-border-light opacity-50";
      }
    } else {
      // Interactive state
      if (isSelected) {
        classes += "border-accent-blue bg-accent-blue/10";
      } else {
        classes += "border-border-light hover:bg-sidebar-hover";
      }
    }
    
    return twMerge(classes);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-soft relative border border-border-light">
      {isLoading && (
        <div className="absolute inset-0 bg-card/75 flex justify-center items-center z-10 backdrop-blur-sm rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-6 text-text-primary">
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
                ${isAnswered && submissionResult?.correct_answer_id === option.id ? 'bg-accent-green text-white' : 
                  isAnswered && selectedOptionId === option.id && !submissionResult?.is_correct ? 'bg-red-500 text-white' :
                  'bg-sidebar-hover text-text-primary'
                }
              `}>
                {String.fromCharCode(65 + option.option_index)}
              </span>
              <span className="text-text-primary">
                {option.option_text}
              </span>
            </div>
          </button>
        ))}
      </div>

      {isAnswered && submissionResult && (
        <div className={`mt-6 p-4 rounded-md border ${submissionResult.is_correct ? 'bg-accent-green/10 border-accent-green/20 text-accent-green' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          <p className="font-medium mb-1">
            {submissionResult.is_correct ? 'Correct!' : 'Incorrect'}
          </p>
          <p className="text-text-primary">{submissionResult.feedback_text}</p>
        </div>
      )}
    </div>
  );
};
