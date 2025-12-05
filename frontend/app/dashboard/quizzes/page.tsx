'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/SupabaseClientProvider';
import { getQuizHistory, QuizHistoryItem, ApiError, deleteQuiz } from '@/lib/api';
import { Trash2 } from 'lucide-react';

export default function QuizHistoryPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizHistory = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getQuizHistory();
        setQuizzes(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load quiz history');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizHistory();
  }, [user]);

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await deleteQuiz(quizId);
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
    } catch (err) {
      console.error('Failed to delete quiz', err);
      alert('Failed to delete quiz.');
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-row bg-background-light font-display text-text-primary">
      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="mx-auto max-w-5xl">
          <Link href="/dashboard" className="text-accent-blue hover:underline mb-4 inline-block">
            &larr; Back to Dashboard
          </Link>

          {/* PageHeading */}
          <div className="flex flex-wrap justify-between gap-3 pb-8">
            <div className="flex min-w-72 flex-col gap-2">
              <h1 className="text-text-primary text-4xl font-black leading-tight tracking-[-0.033em]">Quiz History</h1>
              <p className="text-text-secondary text-lg font-normal leading-normal">Review your past quizzes and results.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-text-secondary">Loading quiz history...</div>
          ) : error ? (
            <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          ) : quizzes.length === 0 ? (
            <div className="border-2 border-dashed border-border-light rounded-lg h-48 flex items-center justify-center bg-white/50">
              <div className="text-center">
                <p className="text-text-secondary mb-2">No quiz history found.</p>
                <Link href="/quiz" className="text-accent-blue hover:underline font-medium">
                  Create your first quiz
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white border border-border-light rounded-xl p-6 shadow-soft hover:shadow-soft-hover transition-all h-full flex flex-col group relative">
                  <Link href={`/quiz/${quiz.id}`} className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center justify-center rounded-lg bg-primary/10 size-10 text-primary shrink-0">
                          <span className="material-symbols-outlined">quiz</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-bold text-text-primary truncate block">{quiz.title}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p className="text-xs text-text-secondary">
                        Taken on: {new Date(quiz.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuiz(quiz.id);
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Quiz"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
