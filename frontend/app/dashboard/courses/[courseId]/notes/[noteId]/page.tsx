'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getNote, updateNote, Note, ApiError } from '@/lib/api';
import NoteEditor from '@/components/NoteEditor';
import QuizConfigModal from '@/components/QuizConfigModal';

export default function NoteDetailsPage() {
  const params = useParams();
  // Use type assertion or check for array to satisfy TypeScript
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;
  const noteId = Array.isArray(params.noteId) ? params.noteId[0] : params.noteId;

  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const fetchData = async () => {
    if (!courseId || !noteId) return;
    setIsLoading(true);
    setError(null);

    try {
      const noteData = await getNote(noteId);
      setNote(noteData);
    } catch (err) {
       if (err instanceof ApiError) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load note details');
        }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId, noteId]);

  const handleSave = async (content: string) => {
    if (!noteId) return;
    try {
      const updatedNote = await updateNote(noteId, content);
      setNote(updatedNote);
    } catch (err) {
      console.error('Save failed in page:', err);
      throw err; 
    }
  };

  const handleGenerateQuiz = (selectedNoteIds: string[], quizLength: number) => {
      console.log('Generating quiz for notes:', selectedNoteIds, 'Length:', quizLength);
  };

  if (isLoading) {
      return <div className="p-10 text-center">Loading...</div>;
  }

  if (error) {
      return (
        <div className="p-10 text-center text-red-600">
            {error}
            <div className="mt-4">
                <Link href={`/dashboard/courses/${courseId}`} className="text-blue-600 underline">
                    Back to Course
                </Link>
            </div>
        </div>
      );
  }

  if (!note) {
      return <div className="p-10 text-center">Note not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
       <header className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
                <Link href={`/dashboard/courses/${courseId}`} className="text-blue-600 hover:text-blue-800 mr-4">
                    &larr; Back to Course
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                    {note.title}
                </h1>
            </div>
            <button
                onClick={() => setIsQuizModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
                Generate Quiz
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Content</h2>
            <NoteEditor 
                initialContent={note?.content || null} 
                onSave={handleSave} 
                lastSavedAt={note?.updated_at}
            />
        </div>
      </main>

      <QuizConfigModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        notes={[note]} // Pass only current note for context-specific quiz? Or fetch all? 
        // Current UI button implies generating quiz from THIS note.
        onGenerate={handleGenerateQuiz}
      />
    </div>
  );
}