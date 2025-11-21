"use client";

import { useEffect, useState } from 'react';
import { Course, Note } from '@/lib/types';

export default function GenerateQuizPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<{ type: 'loading' | 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch('/api/courses');
      const data = await res.json();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      const fetchNotes = async () => {
        const res = await fetch(`/api/courses/${selectedCourseId}`);
        const data = await res.json();
        setNotes(data.notes || []);
      };
      fetchNotes();
    } else {
      setNotes([]);
    }
  }, [selectedCourseId]);

  const handleNoteSelection = (noteId: string) => {
    setSelectedNoteIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedNoteIds.size === notes.length) {
      setSelectedNoteIds(new Set());
    } else {
      setSelectedNoteIds(new Set(notes.map(n => n.id)));
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedCourseId || selectedNoteIds.size === 0) {
      setStatus({ type: 'error', message: 'Please select a course and at least one note.' });
      return;
    }
    setStatus({ type: 'loading', message: 'Generating your quiz...' });

    // This is a placeholder for the actual quiz generation logic
    // You would typically make an API call here
    console.log('Generating quiz for course:', selectedCourseId, 'with notes:', Array.from(selectedNoteIds));
    setTimeout(() => {
      setStatus({ type: 'success', message: 'Quiz successfully created!' });
    }, 2000);
  };

  return (
    <main className="p-10 flex flex-col gap-12">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-[#1D1D1F] text-4xl font-black leading-tight tracking-[-0.033em]">Generate Quiz</p>
          <p className="text-[#1D1D1F]/60 text-base font-normal leading-normal">Select a course and the notes you want to be quizzed on.</p>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h3 className="text-[#1D1D1F] text-lg font-bold leading-tight tracking-[-0.015em]">1. Select Course</h3>
          <div className="flex max-w-[480px]">
            <label className="flex w-full flex-col">
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="form-select flex w-full min-w-0 flex-1 resize-none appearance-none overflow-hidden rounded-xl border border-[#E5E5E7] bg-white px-4 py-3 text-base font-medium text-[#1D1D1F] placeholder:text-[#1D1D1F]/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 h-14"
              >
                <option value="">Select a course...</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </label>
          </div>
        </section>
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[#1D1D1F] text-lg font-bold leading-tight tracking-[-0.015em]">2. Choose notes to include</h3>
            <div className="flex gap-4">
              <button onClick={handleSelectAll} className="text-sm font-medium text-primary">{selectedNoteIds.size === notes.length ? 'Deselect All' : 'Select All'}</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-[#E5E5E7] bg-white p-2">
            {notes.length > 0 ? notes.map(note => (
              <label key={note.id} className="flex cursor-pointer items-center justify-between gap-4 rounded-lg p-4 transition-colors hover:bg-primary/10 has-[:checked]:bg-primary/10">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedNoteIds.has(note.id)}
                    onChange={() => handleNoteSelection(note.id)}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary/50"
                  />
                  <p className="font-medium text-[#1D1D1F]">{note.title}</p>
                </div>
                <p className="text-sm text-[#1D1D1F]/60">{new Date(note.updatedAt).toLocaleDateString()}</p>
              </label>
            )) : (
              <p className="p-4 text-center text-text-secondary">Please select a course to see its notes.</p>
            )}
          </div>
        </section>
        <section className="flex flex-col items-center gap-4 pt-4">
          <button onClick={handleGenerateQuiz} className="mockup-button mockup-button-primary">
            Generate Quiz
          </button>
          <div className="flex min-h-[24px] items-center justify-center gap-2 text-sm text-[#1D1D1F]/60">
            {status?.type === 'loading' && (
              <>
                <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{status.message}</span>
              </>
            )}
            {status?.type === 'success' && (
              <>
                <span className="material-symbols-outlined text-[#34C759] text-xl">check_circle</span>
                <span className="text-[#34C759]">{status.message}</span>
              </>
            )}
            {status?.type === 'error' && (
              <>
                <span className="material-symbols-outlined text-[#FF3B30] text-xl">cancel</span>
                <span className="text-[#FF3B30]">{status.message}</span>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
