'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCourses, getLectures, getLectureNotes, updateLectureNotes, createLecture, Course, Lecture } from '@/lib/api';
import NoteEditor from '@/components/NoteEditor';
import { useAuth } from '@/components/SupabaseClientProvider';

export default function NotesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [noteContent, setNoteContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
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
      } catch (err) {
        console.error('Failed to fetch notes', err);
        setNoteContent(''); // Default to empty if no note exists or error
      }
    };
    fetchNotes();
  }, [selectedLecture]);

  const handleCreateLecture = async () => {
    if (!selectedCourse) return;
    const title = prompt('Enter lecture title:');
    if (!title) return;

    try {
      const newLecture = await createLecture(selectedCourse.id, title);
      setLectures([...lectures, newLecture]);
      setSelectedLecture(newLecture);
    } catch (err) {
      console.error('Failed to create lecture', err);
      alert('Failed to create lecture');
    }
  };

  const handleSaveNote = async (content: string) => {
    if (!selectedLecture) return;
    try {
      const updatedNote = await updateLectureNotes(selectedLecture.id, content);
      setLastSaved(updatedNote.updated_at);
    } catch (err) {
      console.error('Failed to save note', err);
      throw err;
    }
  };

  return (
    <div className="flex h-screen w-full text-text-primary bg-background-light font-display">
      {/* SideNavBar */}
      <aside className="flex h-full w-72 flex-col justify-between border-r border-border-light bg-white p-4">
        <div className="flex flex-col gap-6 overflow-y-auto">
          {/* Back to Dashboard Link styled consistently */}
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>

          <div className="flex flex-col gap-2">
            <div className="px-3 pb-2">
               <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Current Course</label>
               <select 
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-border-light focus:outline-none focus:ring-accent-blue focus:border-accent-blue sm:text-sm rounded-md bg-background-light"
                  value={selectedCourse?.id || ''}
                  onChange={(e) => {
                    const course = courses.find(c => c.id === e.target.value);
                    setSelectedCourse(course || null);
                  }}
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
            </div>

             <div className="flex flex-col gap-1 mt-2">
               {lectures.map(lecture => (
                 <button 
                   key={lecture.id}
                   onClick={() => setSelectedLecture(lecture)}
                   className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors ${selectedLecture?.id === lecture.id ? 'bg-accent-blue/10 text-accent-blue font-medium' : 'text-text-secondary hover:bg-background-light hover:text-text-primary'}`}
                 >
                   <span className="material-symbols-outlined text-[20px]">{selectedLecture?.id === lecture.id ? 'draft' : 'article'}</span>
                   <p className="text-sm leading-normal truncate">{lecture.title}</p>
                 </button>
               ))}
               
               {lectures.length === 0 && !isLoading && (
                  <p className="px-3 text-sm text-text-secondary italic">No notes created yet.</p>
               )}
             </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border-light">
          <button 
            onClick={handleCreateLecture}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-blue py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:bg-accent-blue/90"
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
              <div className="flex items-center justify-between border-b border-border-light pb-4 mb-6">
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
                  {lastSaved && (
                    <div className="flex items-center gap-2 rounded-full bg-white border border-border-light px-3 py-1 shadow-sm">
                      <span className="material-symbols-outlined text-sm text-accent-green">
                        check_circle
                      </span>
                      <span className="text-xs font-medium text-text-secondary">Saved</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Rich Text Editor */}
              <div className="relative flex-1 bg-white rounded-xl border border-border-light shadow-sm min-h-[500px]">
                 <NoteEditor 
                   initialContent={noteContent} 
                   onSave={handleSaveNote}
                   lastSavedAt={lastSaved}
                 />
              </div>
            </>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-text-secondary">
               <div className="bg-white p-6 rounded-full shadow-soft mb-4">
                 <span className="material-symbols-outlined text-4xl text-accent-blue">library_books</span>
               </div>
               <h2 className="text-xl font-bold text-text-primary mb-2">No Note Selected</h2>
               <p className="text-lg">Select a lecture from the sidebar to start writing.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
