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
  let scoreColor = 'text-green-600';
  if (percentage < 50) scoreColor = 'text-red-600';
  else if (percentage < 80) scoreColor = 'text-yellow-600';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-200 dark:border-gray-700 p-8 max-w-lg w-full mx-auto text-center">
      <div className="mb-6 flex justify-center">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Quiz Completed!</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Here is how you performed</p>

      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className={`text-5xl font-extrabold mb-2 ${scoreColor}`}>
          {percentage}%
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          You got <span className="font-semibold">{score}</span> out of <span className="font-semibold">{total_questions}</span> correct
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onNewQuiz}
          className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen size={18} />
          Generate New Quiz
        </button>

        <button
          onClick={onRetake}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <RefreshCw size={18} />
          Retake Same Quiz
        </button>

        <button
          onClick={onBackToCourses}
          className="w-full py-3 px-4 text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center justify-center gap-2"
        >
          Back to Courses
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
