'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCourses, getLectures, generateQuiz, Course, Lecture } from '@/lib/api';
import { useAuth } from '@/components/SupabaseClientProvider';

export default function GenerateQuizPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLectureIds, setSelectedLectureIds] = useState<string[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingLectures, setIsLoadingLectures] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, signOut } = useAuth();

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

    const fetchLectures = async () => {
      setIsLoadingLectures(true);
      setError(null);
      try {
        const data = await getLectures(selectedCourseId);
        setLectures(data);
        // Reset selected lectures when course changes
        setSelectedLectureIds([]);
      } catch (err) {
        console.error('Failed to fetch lectures:', err);
        setError('Failed to load lectures. Please try again.');
      } finally {
        setIsLoadingLectures(false);
      }
    };
    fetchLectures();
  }, [selectedCourseId]);

  const handleToggleLecture = (lectureId: string) => {
    setSelectedLectureIds(prev => 
      prev.includes(lectureId) 
        ? prev.filter(id => id !== lectureId)
        : [...prev, lectureId]
    );
  };

  const handleSelectAll = () => {
    setSelectedLectureIds(lectures.map(l => l.id));
  };

  const handleDeselectAll = () => {
    setSelectedLectureIds([]);
  };

  const handleGenerateQuiz = async () => {
    if (selectedLectureIds.length === 0) {
      setError('Please select at least one note to generate a quiz.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const quiz = await generateQuiz(selectedLectureIds, 10); // Default to 10 questions
      router.push(`/quiz/${quiz.id}`);
    } catch (err: any) {
      console.error('Failed to generate quiz:', err);
      setError(err.message || 'An error occurred while generating the quiz.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-display group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex w-full flex-col max-w-[960px] flex-1">
            
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light px-10 py-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-lg bg-accent-blue size-10">
                  <span className="material-symbols-outlined text-white" style={{fontSize: '24px'}}>school</span>
                </div>
                <h2 className="text-text-primary text-xl font-bold leading-tight">StudyTool</h2>
              </div>
              <div className="flex flex-1 justify-end gap-8">
                <nav className="flex items-center gap-9">
                  <Link className="text-text-primary text-sm font-medium leading-normal hover:text-accent-blue transition-colors" href="/dashboard">Dashboard</Link>
                  <Link className="text-text-primary text-sm font-medium leading-normal hover:text-accent-blue transition-colors" href="/notes">Notes</Link>
                  <Link className="text-accent-blue text-sm font-medium leading-normal" href="/quiz">Quizzes</Link>
                </nav>
                <div className="flex items-center gap-2">
                  <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-border-light/50 text-text-primary hover:bg-border-light">
                    <span className="material-symbols-outlined text-xl">settings</span>
                  </button>
                  <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-border-light/50 text-text-primary hover:bg-border-light">
                    <span className="material-symbols-outlined text-xl">notifications</span>
                  </button>
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                </div>
              </div>
            </header>

            <main className="p-10 flex flex-col gap-12">
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
                    <label className="flex w-full flex-col">
                      {isLoadingCourses ? (
                        <div className="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
                      ) : (
                        <select 
                          className="form-select flex w-full min-w-0 flex-1 resize-none appearance-none overflow-hidden rounded-xl border border-border-light bg-white px-4 py-3 text-base font-medium text-text-primary placeholder:text-text-secondary/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 h-14"
                          value={selectedCourseId}
                          onChange={(e) => setSelectedCourseId(e.target.value)}
                        >
                          {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.name}</option>
                          ))}
                        </select>
                      )}
                    </label>
                  </div>
                </section>

                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em]">2. Choose notes to include</h3>
                    <div className="flex gap-4">
                      <button onClick={handleDeselectAll} className="text-sm font-medium text-text-secondary hover:text-primary">Deselect All</button>
                      <button onClick={handleSelectAll} className="text-sm font-medium text-primary hover:text-primary/80">Select All</button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 rounded-xl border border-border-light bg-white p-2 max-h-[400px] overflow-y-auto">
                    {isLoadingLectures ? (
                      <div className="p-4 text-center text-gray-500">Loading notes...</div>
                    ) : lectures.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No notes found for this course.</div>
                    ) : (
                      lectures.map(lecture => (
                        <label key={lecture.id} className="flex cursor-pointer items-center justify-between gap-4 rounded-lg p-4 transition-colors hover:bg-primary/10 has-[:checked]:bg-primary/10">
                          <div className="flex items-center gap-4">
                            <input 
                              type="checkbox"
                              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary/50"
                              checked={selectedLectureIds.includes(lecture.id)}
                              onChange={() => handleToggleLecture(lecture.id)}
                              disabled={!lecture.has_notes}
                            />
                            <p className={`font-medium text-text-primary ${!lecture.has_notes ? 'text-gray-400' : ''}`}>{lecture.title}</p>
                          </div>
                          <p className="text-sm text-text-secondary">
                            {new Date(lecture.created_at).toLocaleDateString()}
                            {!lecture.has_notes && " (No content)"}
                          </p>
                        </label>
                      ))
                    )}
                  </div>
                </section>

                <section className="flex flex-col items-center gap-4 pt-4">
                  <button 
                    onClick={handleGenerateQuiz}
                    disabled={isGenerating || selectedLectureIds.length === 0}
                    className={`flex w-full max-w-sm cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-4 text-base font-bold text-white transition-opacity hover:opacity-90 ${isGenerating || selectedLectureIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
