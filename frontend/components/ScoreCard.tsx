import React from 'react';
import { RefreshCw, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { QuizResultResponse } from '../lib/services/quiz';

interface ScoreCardProps {
  results: QuizResultResponse;
  onRetake: () => void;
  onNewQuiz: () => void;
  onBackToCourses: () => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ results, onRetake, onNewQuiz, onBackToCourses }) => {
  const { score, total_questions, percentage } = results;

  // Color coding for score
  let scoreColor = 'text-green-600 dark:text-green-400';
  if (percentage < 50) scoreColor = 'text-red-600 dark:text-red-400';
  else if (percentage < 80) scoreColor = 'text-yellow-600 dark:text-yellow-400';

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border-light p-8 max-w-lg w-full mx-auto text-center">
      <div className="mb-6 flex justify-center">
        <CheckCircle className="w-16 h-16 text-accent-green" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-text-primary">Quiz Completed!</h2>
      <p className="text-text-secondary mb-8">Here is how you performed</p>

      <div className="mb-8 p-6 bg-sidebar-hover rounded-lg border border-border-light">
        <div className={`text-5xl font-extrabold mb-2 ${scoreColor}`}>
          {percentage}%
        </div>
        <p className="text-lg text-text-primary">
          You got <span className="font-semibold">{score}</span> out of <span className="font-semibold">{total_questions}</span> correct
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onNewQuiz}
          className="w-full py-3 px-4 bg-card border border-border-light text-text-primary font-medium rounded-lg hover:bg-sidebar-hover transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen size={18} />
          Generate New Quiz
        </button>

        <button
          onClick={onRetake}
          className="w-full py-3 px-4 bg-accent-blue text-white font-medium rounded-lg hover:bg-accent-blue/90 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <RefreshCw size={18} />
          Retake Same Quiz
        </button>

        <button
          onClick={onBackToCourses}
          className="w-full py-3 px-4 text-accent-blue font-medium hover:text-accent-blue/80 transition-colors flex items-center justify-center gap-2"
        >
          Back to Courses
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
