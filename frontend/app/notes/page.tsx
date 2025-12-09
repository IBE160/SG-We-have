'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCourses, getLectures, getLectureNotes, updateLectureNotes, createLecture, updateNote, deleteNote, Course, Lecture } from '@/lib/api';
import NoteEditor from '@/components/NoteEditor';
import { useAuth } from '@/components/SupabaseClientProvider';
import EditableTitle from '@/components/EditableTitle';
import { Trash2 } from 'lucide-react';
import CreateNoteModal from '@/components/CreateNoteModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import CustomSelect from '@/components/CustomSelect';

export default function NotesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [noteContent, setNoteContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  // Fetch courses on load
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch courses', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch lectures when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    
    const fetchLectures = async () => {
      try {
        const data = await getLectures(selectedCourse.id);
        setLectures(data);
        if (data.length > 0) {
          setSelectedLecture(data[0]);
        } else {
          setSelectedLecture(null);
          setNoteContent('');
        }
      } catch (err) {
        console.error('Failed to fetch lectures', err);
      }
    };
    fetchLectures();
  }, [selectedCourse]);

  // Fetch notes when lecture changes
  useEffect(() => {
    if (!selectedLecture) return;

    const fetchNotes = async () => {
      try {
        const note = await getLectureNotes(selectedLecture.id);
        setNoteContent(note ? note.content : '');
        setLastSaved(note ? note.updated_at : null);
        setIsDirty(false);
      } catch (err) {
        console.error('Failed to fetch notes', err);
        setNoteContent(''); // Default to empty if no note exists or error
        setIsDirty(false);
      }
    };
    fetchNotes();
  }, [selectedLecture]);

  const handleNoteCreated = async () => {
    if (!selectedCourse) return;
    // Re-fetch lectures to get the new one, or ideally the modal would return the new note object.
    // For simplicity, let's re-fetch or handle optimistic update if CreateNoteModal supports returning the object.
    // Looking at CreateNoteModal, it calls onNoteCreated() with no args.
    // So we should re-fetch lectures.
    try {
        const data = await getLectures(selectedCourse.id);
        setLectures(data);
        // Select the newest one? Or just list it.
        // Assuming the newest is last or sorted by date.
        if (data.length > 0) {
             // Ideally select the one just created.
             // Since we don't get the ID back from the modal callback, we'll just pick the last one for now or let user select.
             // Actually, let's fetch and select the most recent one.
             // Simple approach: re-fetch list.
             // Better UX: Modal returns created note. But modal props are `onNoteCreated: () => void`.
             // I will stick to re-fetching for now as per existing patterns.
             // To be safe, I'll just refresh the list.
        }
    } catch (err) {
        console.error('Failed to refresh lectures', err);
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
      setLectures(prev => prev.filter(l => l.id !== noteToDelete));
      if (selectedLecture?.id === noteToDelete) {
        setSelectedLecture(null);
        setNoteContent(null);
      }
      setDeleteModalOpen(false);
      setNoteToDelete(null);
    } catch (err) {
      console.error('Failed to delete note', err);
      alert('Failed to delete note'); // Can use a toast here if available, sticking to alert for error fallback or could add error state
    } finally {
        setIsDeleting(false);
    }
  };

  const handleUpdateNoteTitle = async (noteId: string, newTitle: string) => {
    try {
      const updatedNote = await updateNote(noteId, undefined, newTitle);
      setLectures(prev => prev.map(l => l.id === noteId ? updatedNote : l));
      if (selectedLecture?.id === noteId) {
        setSelectedLecture(updatedNote);
      }
    } catch (err) {
      console.error('Failed to update note title', err);
      throw err; // Propagate to EditableTitle
    }
  };

  const handleSaveNote = async (content: string) => {
    if (!selectedLecture) return;
    try {
      const updatedNote = await updateLectureNotes(selectedLecture.id, content);
      setLastSaved(updatedNote.updated_at);
      setIsDirty(false);
    } catch (err) {
      console.error('Failed to save note', err);
      throw err;
    }
  };

  const handleNoteUpdate = (content: string) => {
      setIsDirty(true);
  };

  return (
    <div className="flex h-screen w-full text-text-primary bg-background-light font-display">
      {/* SideNavBar */}
      <aside className="flex h-full w-72 flex-col justify-between border-r border-border-light bg-sidebar p-4">
        <div className="flex flex-col gap-6 overflow-y-auto">
          {/* Back to Dashboard Link styled consistently */}
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>

          <div className="flex flex-col gap-2">
            <CustomSelect
              label="Current Course"
              options={courses}
              value={selectedCourse}
              onChange={setSelectedCourse}
              placeholder="Select a course"
              className="px-3 pb-2"
            />

             <div className="flex flex-col gap-1 mt-2">
               {lectures.map(lecture => (
                 <div 
                   key={lecture.id}
                   onClick={() => setSelectedLecture(lecture)}
                   className={`flex items-center justify-between px-3 py-2.5 rounded-lg w-full text-left transition-colors cursor-pointer ${selectedLecture?.id === lecture.id ? 'bg-accent-blue/10 text-accent-blue font-medium' : 'text-text-secondary hover:bg-sidebar-hover hover:text-text-primary'}`}
                 >
                   <div className="flex items-center gap-3 overflow-hidden flex-grow">
                        <span className="material-symbols-outlined text-[20px] shrink-0">{selectedLecture?.id === lecture.id ? 'draft' : 'article'}</span>
                        <div className="min-w-0 flex-1">
                            <EditableTitle
                                initialTitle={lecture.title}
                                onSave={async (newTitle) => handleUpdateNoteTitle(lecture.id, newTitle)}
                                className="text-sm leading-normal truncate block"
                                inputClassName="text-sm w-full"
                            />
                        </div>
                   </div>
                   <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(lecture.id);
                        }}
                        className="text-text-secondary hover:text-red-500 p-1 rounded-md hover:bg-red-500/10 shrink-0 ml-2"
                        title="Delete Note"
                    >
                        <Trash2 size={16} />
                    </button>
                 </div>
               ))}
               
               {lectures.length === 0 && !isLoading && (
                  <p className="px-3 text-sm text-text-secondary italic">No notes created yet.</p>
               )}
             </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border-light">
          <button 
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedCourse}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-blue py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:bg-accent-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">add</span>
            <span>New Note</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background-light">
        <div className="mx-auto flex h-full max-w-4xl flex-col px-8 py-6">
          {selectedLecture ? (
            <>
              {/* Header Section */}
              <div className="flex items-center gap-4 justify-between border-b border-border-light pb-4 mb-6">
                <div className="w-full">
                  <input 
                    className="w-full border-none bg-transparent p-0 text-4xl font-black text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-0" 
                    value={selectedLecture.title}
                    readOnly // For now readOnly title
                  />
                  <p className="mt-2 text-sm font-medium text-text-secondary">
                    Last edited: {new Date(selectedLecture.created_at).toLocaleDateString()}
                  </p>
                </div>
                {/* ToolBar Status */}
                <div className="flex items-center gap-2 shrink-0">
                  {lastSaved && !isDirty && (
                    <div className="flex items-center gap-2 rounded-full bg-card border border-border-light px-3 py-1 shadow-sm">
                      <span className="material-symbols-outlined text-sm text-accent-green">
                        check_circle
                      </span>
                      <span className="text-xs font-medium text-text-secondary">Saved</span>
                    </div>
                  )}
                  {isDirty && (
                    <div className="flex items-center gap-2 rounded-full bg-card border border-border-light px-3 py-1 shadow-sm">
                      <span className="material-symbols-outlined text-sm text-amber-500">
                        pending
                      </span>
                      <span className="text-xs font-medium text-text-secondary">Unsaved changes</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rich Text Editor */}
              <div className="relative flex-1">
                 <NoteEditor 
                   initialContent={noteContent} 
                   onSave={handleSaveNote}
                   onUpdate={handleNoteUpdate}
                   lastSavedAt={lastSaved}
                 />
              </div>
            </>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-text-secondary">
               <div className="bg-card p-6 rounded-full shadow-soft mb-4">
                 <span className="material-symbols-outlined text-4xl text-accent-blue">library_books</span>
               </div>
               <h2 className="text-xl font-bold text-text-primary mb-2">No Note Selected</h2>
               <p className="text-lg">Select a lecture from the sidebar to start writing.</p>
             </div>
          )}
        </div>
      </main>

      {selectedCourse && (
        <CreateNoteModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            courseId={selectedCourse.id}
            onNoteCreated={handleNoteCreated}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteNote}
        title="Delete Note"
        message="Are you sure you want to delete this note?"
        isLoading={isDeleting}
      />
    </div>
  );
}
