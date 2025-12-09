'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCourses, getNotes, generateQuiz, Course, Note } from '@/lib/api';
import AppHeader from '@/components/AppHeader';
import CustomSelect from '@/components/CustomSelect';

export default function GenerateQuizPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [quizLength, setQuizLength] = useState<number>(10);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again.');
      } finally {
        setIsLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;

    const fetchNotes = async () => {
      setIsLoadingNotes(true);
      setError(null);
      try {
        const data = await getNotes(selectedCourseId);
        setNotes(data);
        // Reset selected notes when course changes
        setSelectedNoteIds([]);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
        setError('Failed to load notes. Please try again.');
      } finally {
        setIsLoadingNotes(false);
      }
    };
    fetchNotes();
  }, [selectedCourseId]);

  const handleToggleNote = (noteId: string) => {
    setSelectedNoteIds(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleSelectAll = () => {
    // Only select notes that have content
    setSelectedNoteIds(notes.filter(n => n.content).map(n => n.id));
  };

  const handleDeselectAll = () => {
    setSelectedNoteIds([]);
  };

  const handleGenerateQuiz = async () => {
    if (selectedNoteIds.length === 0) {
      setError('Please select at least one note to generate a quiz.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const quiz = await generateQuiz(selectedNoteIds, quizLength);
      router.push(`/quiz/${quiz.id}`);
    } catch (err) {
      console.error('Failed to generate quiz:', err);
      const message = err instanceof Error ? err.message : 'An error occurred while generating the quiz.';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const quizLengthOptions = [5, 10, 15, 20, 25, 30].map((length) => ({
    id: String(length),
    name: `${length} Questions`
  }));

  const selectedQuizLengthOption = quizLengthOptions.find(opt => Number(opt.id) === quizLength) || null;
  const selectedCourseOption = courses.find(c => c.id === selectedCourseId) || null;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-display group/design-root overflow-x-hidden">
      {/* Header */}
      <AppHeader />
      
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex w-full flex-col max-w-[960px] flex-1">
            <main className="p-10 pb-40 flex flex-col gap-12">
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-text-primary text-4xl font-black leading-tight tracking-[-0.033em]">Generate Quiz</p>
                  <p className="text-text-secondary text-base font-normal leading-normal">Select a course and the notes you want to be quizzed on.</p>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-8">
                <section className="flex flex-col gap-4">
                  <h3 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em]">1. Select Course</h3>
                  <div className="flex max-w-[480px]">
                    {isLoadingCourses ? (
                      <div className="h-10 w-full bg-gray-100 rounded-md animate-pulse"></div>
                    ) : (
                      <CustomSelect
                        options={courses}
                        value={selectedCourseOption}
                        onChange={(option) => setSelectedCourseId(option.id)}
                        placeholder="Select a course"
                        className="w-full"
                      />
                    )}
                  </div>
                </section>

                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em]">2. Choose notes to include</h3>
                    <div className="flex gap-4">
                      <button onClick={handleDeselectAll} className="text-sm font-medium text-text-secondary hover:text-accent-blue">Deselect All</button>
                      <button onClick={handleSelectAll} className="text-sm font-medium text-accent-blue hover:text-accent-blue/80">Select All</button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 rounded-xl border border-border-light bg-white p-2 max-h-[400px] overflow-y-auto">
                    {isLoadingNotes ? (
                      <div className="p-4 text-center text-gray-500">Loading notes...</div>
                    ) : notes.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No notes found for this course.</div>
                    ) : (
                      notes.map(note => {
                        const hasContent = !!note.content;
                        return (
                          <label key={note.id} className="flex cursor-pointer items-center justify-between gap-4 rounded-lg p-4 transition-colors hover:bg-accent-blue/10 has-[:checked]:bg-accent-blue/10">
                            <div className="flex items-center gap-4">
                              <input 
                                type="checkbox"
                                className="h-5 w-5 rounded border-gray-300 text-accent-blue focus:ring-accent-blue/50"
                                checked={selectedNoteIds.includes(note.id)}
                                onChange={() => handleToggleNote(note.id)}
                                disabled={!hasContent}
                              />
                              <p className={`font-medium text-text-primary ${!hasContent ? 'text-gray-400' : ''}`}>{note.title}</p>
                            </div>
                            <p className="text-sm text-text-secondary">
                              {new Date(note.created_at).toLocaleDateString()}
                              {!hasContent && " (No content)"}
                            </p>
                          </label>
                        );
                      })
                    )}
                  </div>
                </section>

                <section className="flex flex-col gap-4">
                  <h3 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em]">3. Number of Questions</h3>
                  <div className="flex max-w-[480px]">
                    <CustomSelect
                        options={quizLengthOptions}
                        value={selectedQuizLengthOption}
                        onChange={(option) => setQuizLength(Number(option.id))}
                        placeholder="Select number of questions"
                        className="w-full"
                        dropdownPosition="absolute"
                    />
                  </div>
                </section>

                <section className="flex flex-col items-center gap-4 pt-4">
                  <button 
                    onClick={handleGenerateQuiz}
                    disabled={isGenerating || selectedNoteIds.length === 0}
                    className={`flex w-full max-w-sm cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent-blue px-6 py-4 text-base font-bold text-white transition-opacity hover:opacity-90 ${isGenerating || selectedNoteIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isGenerating ? 'Generating Quiz...' : 'Generate Quiz'}
                  </button>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}