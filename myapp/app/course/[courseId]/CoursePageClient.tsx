"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Modal from '@/app/components/Modal';
import DynamicTiptap from '@/app/components/DynamicTiptap';

interface Course {
  id: string;
  title: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  courseId: string;
  updatedAt: string;
}

interface CoursePageClientProps {
  courseId: string;
}

export default function CoursePageClient({ courseId }: CoursePageClientProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  // Load all courses and notes from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCourses = localStorage.getItem('courses');
      const allCourses: Course[] = savedCourses ? JSON.parse(savedCourses) : [];
      const foundCourse = allCourses.find(c => c.id === courseId);
      setCourse(foundCourse || null);

      const savedNotes = localStorage.getItem('notes');
      const allNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];
      const courseSpecificNotes = allNotes.filter(note => note.courseId === courseId);
      setNotes(courseSpecificNotes);

      if (courseSpecificNotes.length > 0) {
        setSelectedNote(courseSpecificNotes[0]);
      } else {
        setSelectedNote(null);
      }
    }
  }, [courseId]);

  // Save notes to localStorage whenever the notes state changes
  useEffect(() => {
    if (typeof window !== 'undefined' && course) {
      const savedNotes = localStorage.getItem('notes');
      const allNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];
      // Remove existing notes for this course
      const otherNotes = allNotes.filter(note => note.courseId !== course.id);
      // Add current notes for this course
      localStorage.setItem('notes', JSON.stringify([...otherNotes, ...notes]));
    }
  }, [notes, course]);


  const handleNewNote = () => {
    if (!course) return; // Should not happen if course is loaded

    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '',
      courseId: course.id,
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [...prev, newNote]);
    setSelectedNote(newNote);
  };

  const handleDeleteNote = () => {
    if (noteToDelete) {
      setNotes(prev => prev.filter(note => note.id !== noteToDelete.id));
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
      if (selectedNote?.id === noteToDelete.id) {
        setSelectedNote(null); // Deselect if the deleted note was selected
      }
    }
  };

  const handleNoteContentChange = (newContent: string) => {
    if (selectedNote) {
      const updatedNote = { ...selectedNote, content: newContent, updatedAt: new Date().toISOString() };
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === updatedNote.id ? updatedNote : note
        )
      );
      setSelectedNote(updatedNote);
    }
  };

  if (!course) {
    return (
      <main className="flex-1 p-10">
        <h1>Loading course...</h1>
        <p>Course with ID "{courseId}" not found or not loaded.</p>
      </main>
    );
  }

  return (
    <div className="flex h-screen w-full text-primary-text">
      {/* Notes List Sidebar */}
      <aside className="flex h-full w-72 flex-col justify-between border-r border-border-color bg-background-light p-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-3 py-2">
            <Link href="/course" className="flex items-center gap-3 text-sm font-medium leading-normal text-primary">
              <span className="material-symbols-outlined text-secondary-text">chevron_left</span>
              All Courses
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="px-3 text-base font-semibold text-primary-text">{course.title}</h2>
            {notes.length > 0 ? notes.map(note => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`flex items-center justify-between gap-3 px-3 py-2 cursor-pointer rounded-lg ${selectedNote?.id === note.id ? 'bg-primary/10' : ''}`}
              >
                <p className={`text-sm font-medium leading-normal ${selectedNote?.id === note.id ? 'text-primary' : 'text-secondary-text'}`}>{note.title}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNoteToDelete(note);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-secondary-text hover:text-red-500"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            )) : (
              <p className="px-3 py-2 text-sm text-text-secondary">No notes yet. Create one!</p>
            )}
          </div>
        </div>
        <button onClick={handleNewNote} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-secondary text-text-dark text-sm font-bold leading-normal tracking-[0.015em] w-full shadow-md hover:bg-secondary/80">
          <span className="truncate">+ New Note</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {selectedNote ? (
          <div className="mx-auto flex h-full max-w-4xl flex-col px-8 py-6">
            <DynamicTiptap
              courseId={courseId}
              noteId={selectedNote.id}
              initialContent={selectedNote.content}
              onContentChange={handleNoteContentChange}
              key={selectedNote.id}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <h2 className="text-2xl font-bold">No note selected</h2>
              <p className="text-text-secondary">Select a note from the list or create a new one.</p>
            </div>
          </div>
        )}
      </main>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Note">
        <p>Are you sure you want to delete &quot;{noteToDelete?.title}&quot;?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 rounded-lg border" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          <button className="px-4 py-2 rounded-lg bg-red-500 text-white" onClick={handleDeleteNote}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}
