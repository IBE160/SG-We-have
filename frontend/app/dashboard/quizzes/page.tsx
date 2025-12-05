'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/SupabaseClientProvider';
import { getQuizHistory, QuizHistoryItem, ApiError, deleteQuiz, updateQuiz } from '@/lib/api';
import { Trash2 } from 'lucide-react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import AppHeader from '@/components/AppHeader';
import EditableTitle from '@/components/EditableTitle';

export default function QuizHistoryPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleUpdateQuiz = async (quizId: string, newTitle: string) => {
    try {
      await updateQuiz(quizId, newTitle);
      setQuizzes(prev => prev.map(q => q.id === quizId ? { ...q, title: newTitle } : q));
    } catch (err) {
      console.error('Failed to update quiz title', err);
      alert('Failed to update quiz title.');
    }
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizToDelete(quizId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteQuiz = async () => {
    if (!quizToDelete) return;

    setIsDeleting(true);
    try {
      await deleteQuiz(quizToDelete);
      setQuizzes(prev => prev.filter(q => q.id !== quizToDelete));
      setDeleteModalOpen(false);
      setQuizToDelete(null);
    } catch (err) {
      console.error('Failed to delete quiz', err);
      alert('Failed to delete quiz.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light font-display text-text-primary">
      {/* AppHeader */}
      <AppHeader />

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
                        <div className="flex-1 min-w-0" onClick={(e) => e.preventDefault()}>
                           <EditableTitle
                              initialTitle={quiz.title}
                              onSave={async (newTitle) => handleUpdateQuiz(quiz.id, newTitle)}
                              className="text-lg font-bold text-text-primary truncate block hover:text-accent-blue transition-colors"
                              inputClassName="text-lg font-bold w-full"
                            />
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
                    className="absolute bottom-4 right-4 text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
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

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteQuiz}
        title="Delete Quiz"
        message="Are you sure you want to delete this quiz?"
        isLoading={isDeleting}
      />
    </div>
  );
}
