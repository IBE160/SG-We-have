'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getCourses, getNotes, generateQuiz, updateCourse, updateNote, deleteNote, Course, Note, ApiError } from '@/lib/api';
import CreateNoteModal from '@/components/CreateNoteModal';
import QuizConfigModal from '@/components/QuizConfigModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import EditableTitle from '@/components/EditableTitle';
import AppHeader from '@/components/AppHeader';
import { Trash2 } from 'lucide-react';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  // Handle params.courseId possibly being string | string[]
  // Renamed from params.id to params.courseId to match directory structure [courseId]
  const id = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      // Fetch courses to find the current one (since we don't have getCourseById yet)
      // In a real app, we'd likely fetch these in parallel, but we need the course first to confirm ownership/existence
      const courses = await getCourses();
      const foundCourse = courses.find(c => c.id === id);
      
      if (!foundCourse) {
        setError('Course not found or access denied.');
        return;
      }
      setCourse(foundCourse);

      // Fetch notes
      const notesData = await getNotes(id);
      setNotes(notesData);
      
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load course details');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleNoteCreated = () => {
    setSuccessMessage('Note added successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
    fetchData(); // Refresh list
  };

  const handleUpdateCourse = async (newName: string) => {
    if (!course) return;
    try {
      const updatedCourse = await updateCourse(course.id, newName);
      setCourse(updatedCourse);
    } catch (err) {
      console.error('Failed to update course:', err);
      throw err;
    }
  };

  const handleUpdateNoteTitle = async (noteIdToUpdate: string, newTitle: string) => {
    try {
      const updatedNote = await updateNote(noteIdToUpdate, undefined, newTitle);
      setNotes(prevNotes => 
        prevNotes.map(note => note.id === noteIdToUpdate ? updatedNote : note)
      );
    } catch (err) {
      console.error('Failed to update note title:', err);
      throw err;
    }
  };

  const handleDeleteNote = (noteId: string) => {
      setNoteToDelete(noteId);
      setDeleteModalOpen(true);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteNote(noteToDelete);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteToDelete));
      setSuccessMessage('Note deleted successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
      setDeleteModalOpen(false);
      setNoteToDelete(null);
    } catch (err) {
      console.error('Failed to delete note:', err);
      setError('Failed to delete note.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateQuiz = async (selectedNoteIds: string[], quizLength: number) => {
    try {
      const quiz = await generateQuiz(selectedNoteIds, quizLength);
      router.push(`/quiz/${quiz.id}`);
    } catch (err) {
      console.error('Failed to generate quiz:', err);
      alert('Failed to generate quiz. Please try again.');
    }
  };

  if (!id) return <div className="p-10 text-center">Invalid Course ID</div>;

  return (
    <div className="min-h-screen bg-gray-100">
       <AppHeader />
       <div className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                    &larr; Back to Dashboard
                </Link>
                {course ? (
                    <EditableTitle 
                        initialTitle={course.name} 
                        onSave={handleUpdateCourse} 
                        className="text-3xl font-bold text-gray-900"
                    />
                ) : (
                    <h1 className="text-3xl font-bold text-gray-900">Loading...</h1>
                )}
            </div>
          {course && (
            <div className="flex space-x-4">
             <Link
                href="/quiz"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
             >
               Generate Quiz
             </Link>
             <button
               onClick={() => setIsModalOpen(true)}
               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
             >
               Add notes
             </button>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {successMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {isLoading ? (
           <div className="text-center py-10">Loading details...</div>
        ) : !course ? (
            <div className="text-center py-10">Course not found.</div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {notes.length === 0 ? (
               <div className="p-6 text-center text-gray-500">
                 No notes yet. Click "Add notes" to get started.
               </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notes.map((note) => (
                  <li key={note.id}>
                    <div 
                        onClick={() => router.push(`/dashboard/courses/${id}/notes/${note.id}`)}
                        className="block px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center flex-grow">
                                <EditableTitle
                                    initialTitle={note.title}
                                    onSave={async (newTitle) => handleUpdateNoteTitle(note.id, newTitle)}
                                    className="text-lg font-medium text-blue-600 truncate"
                                    inputClassName="text-lg"
                                />
                            </div>
                            <div className="ml-2 flex-shrink-0 flex items-center gap-4">
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                    {new Date(note.created_at).toLocaleDateString()}
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNote(note.id);
                                    }}
                                    className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                                    title="Delete Note"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      {course && (
        <>
          <CreateNoteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            courseId={course.id}
            onNoteCreated={handleNoteCreated}
          />
          <QuizConfigModal
            isOpen={isQuizModalOpen}
            onClose={() => setIsQuizModalOpen(false)}
            notes={notes}
            onGenerate={handleGenerateQuiz}
          />
          
          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={confirmDeleteNote}
            title="Delete Note"
            message="Are you sure you want to delete this note?"
            isLoading={isDeleting}
          />
        </>
      )}
    </div>
  );
}
