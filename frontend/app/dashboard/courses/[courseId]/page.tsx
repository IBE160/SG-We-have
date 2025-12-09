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
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
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
      const coursesData = await getCourses();
      setCourses(coursesData);
      const foundCourse = coursesData.find(c => c.id === id);
      
      if (!foundCourse) {
        setError('Course not found or access denied.');
        return;
      }
      setCourse(foundCourse);

      // Fetch notes for the current course
      const notesData = await getNotes(id);
      setNotes(notesData);
      
      // Fetch all notes for the quiz modal
      const allNotesData = await Promise.all(coursesData.map(c => getNotes(c.id)));
      setAllNotes(allNotesData.flat());
      
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

  const handleGenerateQuiz = async (selectedNoteIds: string[], quizLength: number, courseId: string) => {
    try {
      const quiz = await generateQuiz(selectedNoteIds, quizLength, courseId);
      router.push(`/quiz/${quiz.id}`);
    } catch (err) {
      console.error('Failed to generate quiz:', err);
      alert('Failed to generate quiz. Please try again.');
    }
  };

  if (!id) return <div className="p-10 text-center text-text-primary">Invalid Course ID</div>;

  return (
    <div className="min-h-screen bg-background-light text-text-primary font-display">
       <AppHeader />
       <div className="bg-card border-b border-border-light shadow-sm mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
                {course ? (
                    <EditableTitle 
                        initialTitle={course.name} 
                        onSave={handleUpdateCourse} 
                        className="text-3xl font-bold text-text-primary"
                        inputClassName="text-3xl font-bold"
                    />
                ) : (
                    <h1 className="text-3xl font-bold text-text-primary">Loading...</h1>
                )}
            </div>
          {course && (
            <div className="flex space-x-4">
             <button
                onClick={() => setIsQuizModalOpen(true)}
                className="bg-accent-purple text-white px-4 py-2 rounded-md hover:bg-accent-purple/90 transition-colors shadow-sm font-medium"
             >
               Generate Quiz
             </button>
             <button
               onClick={() => setIsModalOpen(true)}
               className="bg-accent-blue text-white px-4 py-2 rounded-md hover:bg-accent-blue/90 transition-colors shadow-sm font-medium"
             >
               Add notes
             </button>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {successMessage && (
            <div className="mb-4 p-4 bg-accent-green/10 text-accent-green border border-accent-green/20 rounded-md">
              {successMessage}
            </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md">
            {error}
          </div>
        )}

        {isLoading ? (
           <div className="text-center py-10 text-text-secondary">Loading details...</div>
        ) : !course ? (
            <div className="text-center py-10 text-text-secondary">Course not found.</div>
        ) : (
          <div className="bg-card shadow-soft rounded-xl overflow-hidden border border-border-light">
            {notes.length === 0 ? (
               <div className="p-10 text-center text-text-secondary flex flex-col items-center gap-2">
                 <span className="material-symbols-outlined text-4xl text-text-secondary/50">note_stack</span>
                 <p>No notes yet. Click "Add notes" to get started.</p>
               </div>
            ) : (
              <ul className="divide-y divide-border-light">
                {notes.map((note) => (
                  <li key={note.id}>
                    <div 
                        onClick={() => router.push(`/dashboard/courses/${id}/notes/${note.id}`)}
                        className="block px-4 py-4 sm:px-6 hover:bg-sidebar-hover cursor-pointer transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center flex-grow min-w-0">
                                <span className="material-symbols-outlined text-text-secondary mr-3 shrink-0">description</span>
                                <div className="min-w-0 flex-1">
                                  <EditableTitle
                                      initialTitle={note.title}
                                      onSave={async (newTitle) => handleUpdateNoteTitle(note.id, newTitle)}
                                      className="text-lg font-medium text-text-primary truncate block"
                                      inputClassName="text-lg w-full"
                                  />
                                </div>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex items-center gap-4">
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-sidebar-hover text-text-secondary border border-border-light">
                                    {new Date(note.created_at).toLocaleDateString()}
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNote(note.id);
                                    }}
                                    className="text-text-secondary hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-red-500/10"
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
            notes={allNotes}
            currentCourseId={course.id}
            onGenerate={(selectedNoteIds, quizLength) => handleGenerateQuiz(selectedNoteIds, quizLength, course.id)}
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
