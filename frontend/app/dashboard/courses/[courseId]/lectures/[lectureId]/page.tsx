'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getLectures, getLectureNotes, updateLectureNotes, Lecture, Note, ApiError } from '@/lib/api';
import NoteEditor from '@/components/NoteEditor';

export default function LectureDetailsPage() {
  const params = useParams();
  // Use type assertion or check for array to satisfy TypeScript
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;
  const lectureId = Array.isArray(params.lectureId) ? params.lectureId[0] : params.lectureId;

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !lectureId) return;
      setIsLoading(true);
      setError(null);

      try {
        // 1. Get lecture details (title)
        // We fetch all lectures for the course and find the specific one
        const lectures = await getLectures(courseId);
        const foundLecture = lectures.find(l => l.id === lectureId);

        if (!foundLecture) {
          setError('Lecture not found or access denied.');
          return;
        }
        setLecture(foundLecture);

        // 2. Get notes
        const noteData = await getLectureNotes(lectureId);
        setNote(noteData);

      } catch (err) {
         if (err instanceof ApiError) {
            setError(err.message);
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Failed to load lecture details');
          }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId, lectureId]);

  const handleSave = async (content: string) => {
    if (!lectureId) return;
    try {
      await updateLectureNotes(lectureId, content);
    } catch (err) {
      // Error handling is done in NoteEditor via promise rejection, 
      // but we can also log or show global error here if needed.
      console.error('Save failed in page:', err);
      throw err; // Re-throw so NoteEditor detects failure
    }
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

  if (!lecture) {
      return <div className="p-10 text-center">Lecture not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
       <header className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
                <Link href={`/dashboard/courses/${courseId}`} className="text-blue-600 hover:text-blue-800 mr-4">
                    &larr; Back to Course
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                    {lecture.title}
                </h1>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Lecture Notes</h2>
            <NoteEditor initialContent={note?.content || null} onSave={handleSave} />
        </div>
      </main>
    </div>
  );
}
