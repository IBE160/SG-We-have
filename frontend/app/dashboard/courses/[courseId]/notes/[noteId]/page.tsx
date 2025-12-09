'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getNote, updateNote, Note, ApiError } from '@/lib/api';
import NoteEditor from '@/components/NoteEditor';
import EditableTitle from '@/components/EditableTitle';
import AppHeader from '@/components/AppHeader';

export default function NoteDetailsPage() {
  const params = useParams();
  // Use type assertion or check for array to satisfy TypeScript
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;
  const noteId = Array.isArray(params.noteId) ? params.noteId[0] : params.noteId;

  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleUpdateTitle = async (newTitle: string) => {
    if (!noteId) return;
    try {
      const updatedNote = await updateNote(noteId, undefined, newTitle);
      setNote(updatedNote);
    } catch (err) {
      console.error('Title update failed:', err);
      throw err;
    }
  };

  if (isLoading) {
      return <div className="p-10 text-center text-text-secondary">Loading...</div>;
  }

  if (error) {
      return (
        <div className="p-10 text-center text-red-500">
            {error}
            <div className="mt-4">
                <Link href={`/dashboard/courses/${courseId}`} className="text-accent-blue hover:underline">
                    Back to Course
                </Link>
            </div>
        </div>
      );
  }

  if (!note) {
      return <div className="p-10 text-center text-text-secondary">Note not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background-light text-text-primary font-display">
       <AppHeader />
       <div className="bg-card border-b border-border-light shadow-sm mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/courses/${courseId}`} className="text-accent-blue hover:text-accent-blue/80 flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    <span>Back to Course</span>
                </Link>
                <EditableTitle
                    initialTitle={note.title}
                    onSave={handleUpdateTitle}
                    className="text-3xl font-bold text-text-primary"
                    inputClassName="text-3xl font-bold"
                />
            </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card shadow-soft sm:rounded-md p-6 border border-border-light">
            <h2 className="text-lg font-medium text-text-primary mb-4">Content</h2>
            <NoteEditor 
                initialContent={note?.content || null} 
                onSave={handleSave} 
                lastSavedAt={note?.updated_at}
            />
        </div>
      </main>
    </div>
  );
}