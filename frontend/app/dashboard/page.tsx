'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CreateCourseModal from '@/components/CreateCourseModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import SettingsModal from '@/components/SettingsModal';
import { getCourses, updateCourse, deleteCourse, Course, ApiError } from '@/lib/api';
import { useAuth } from '@/components/SupabaseClientProvider';
import EditableTitle from '@/components/EditableTitle';
import { Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
       if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load courses');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseCreated = () => {
    setSuccessMessage('Course created successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
    fetchCourses();
  };

  const handleUpdateCourse = async (courseId: string, newName: string) => {
    try {
      const updatedCourse = await updateCourse(courseId, newName);
      setCourses(prev => prev.map(c => c.id === courseId ? updatedCourse : c));
    } catch (err) {
      console.error('Failed to update course name', err);
      alert('Failed to update course name');
    }
  };

  const handleDeleteCourse = (courseId: string) => {
      setCourseToDelete(courseId);
      setDeleteModalOpen(true);
  };

  const confirmDeleteCourse = async () => {
      if (!courseToDelete) return;
      
      setIsDeleting(true);
      try {
          await deleteCourse(courseToDelete);
          setCourses(prev => prev.filter(c => c.id !== courseToDelete));
          setSuccessMessage('Course deleted successfully.');
          setTimeout(() => setSuccessMessage(null), 3000);
          setDeleteModalOpen(false);
          setCourseToDelete(null);
      } catch (err) {
          console.error('Failed to delete course', err);
          setError('Failed to delete course.'); // Show error in UI instead of alert
      } finally {
          setIsDeleting(false);
      }
  };

  const sidebarItemClass = "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-text-secondary transition-colors hover:bg-sidebar-hover hover:text-text-primary text-left";
  const activeSidebarItemClass = "flex w-full items-center gap-3 rounded-lg bg-sidebar-hover px-3 py-2.5 text-text-primary transition-colors";

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-row bg-background-light font-display text-text-primary">
      {/* SideNavBar */}
      <aside className="flex h-screen w-64 flex-col border-r border-border-light bg-sidebar p-4 sticky top-0">
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3 px-3">
              <div className="flex items-center justify-center rounded-lg bg-accent-blue size-10">
                <span className="material-symbols-outlined text-white" style={{fontSize: '24px'}}>school</span>
              </div>
              <h1 className="text-text-primary text-xl font-bold">StudyTool</h1>
            </div>
            <nav className="flex flex-col gap-2">
              <button onClick={() => setIsModalOpen(true)} className={sidebarItemClass}>
                <span className="material-symbols-outlined" style={{fontSize: '24px'}}>add_circle</span>
                <p className="text-sm font-medium">New Course</p>
              </button>
              <Link href="/notes" className={sidebarItemClass}>
                <span className="material-symbols-outlined" style={{fontSize: '24px'}}>note_add</span>
                <p className="text-sm font-medium">New Note</p>
              </Link>
              <Link href="/quiz" className={sidebarItemClass}>
                <span className="material-symbols-outlined" style={{fontSize: '24px'}}>quiz</span>
                <p className="text-sm font-medium">New Quiz</p>
              </Link>
              <Link href="/dashboard" className={activeSidebarItemClass}>
                <span className="material-symbols-outlined" style={{fontSize: '24px', fontVariationSettings: "'FILL' 1"}}>collections_bookmark</span>
                <p className="text-sm font-medium">My Courses</p>
              </Link>
              <Link href="/dashboard/quizzes" className={sidebarItemClass}>
                <span className="material-symbols-outlined" style={{fontSize: '24px'}}>history</span>
                <p className="text-sm font-medium">Quiz History</p>
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-text-secondary transition-colors hover:bg-sidebar-hover hover:text-text-primary text-left cursor-pointer"
            >
              <span className="material-symbols-outlined" style={{fontSize: '24px'}}>settings</span>
              <p className="text-sm font-medium">Settings</p>
            </button>
            <div className="flex items-center gap-4 rounded-lg p-2">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {user?.email?.[0].toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-text-primary text-sm font-semibold leading-normal truncate">{user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-text-secondary text-xs font-normal leading-normal truncate">{user?.email}</p>
              </div>
              <button onClick={() => signOut()} className="material-symbols-outlined text-text-secondary ml-auto hover:text-red-500 transition-colors" style={{fontSize: '20px'}}>logout</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="mx-auto max-w-5xl">
          {/* PageHeading */}
          <div className="flex flex-wrap justify-between gap-3 pb-8">
            <div className="flex min-w-72 flex-col gap-2">
              <h1 className="text-text-primary text-4xl font-black leading-tight tracking-[-0.033em]">Welcome back, {user?.email?.split('@')[0] || 'Student'}!</h1>
              <p className="text-text-secondary text-lg font-normal leading-normal">Ready to dive back into your studies?</p>
            </div>
          </div>

          {successMessage && (
            <div className="mb-8 p-4 bg-green-100 text-green-700 rounded-md border border-green-200">
              {successMessage}
            </div>
          )}
          {error && (
             <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {/* Action Cards */}
          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <div className="absolute inset-x-0 top-1/2 h-64 -translate-y-1/2 transform">
              <div className="absolute left-[5%] h-full w-2/5 rounded-full bg-accent-blue/10 blur-3xl"></div>
              <div className="absolute right-[5%] h-full w-2/5 rounded-full bg-accent-purple/10 blur-3xl"></div>
            </div>
            
            {/* Card 1: Create New Course */}
            <div className="relative flex flex-col justify-between gap-6 rounded-xl border border-border-light bg-card p-6 shadow-soft backdrop-blur-md transition-shadow hover:shadow-soft-hover">
              <div className="flex flex-col gap-3">
                <div className="flex size-12 items-center justify-center rounded-lg bg-accent-blue/10">
                  <span className="material-symbols-outlined text-accent-blue" style={{fontSize: '28px'}}>add_circle</span>
                </div>
                <h2 className="text-text-primary text-xl font-bold leading-normal">Create a New Course</h2>
                <p className="text-text-secondary text-sm font-normal leading-normal">Start by organizing your notes into a new subject.</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="w-full rounded-lg bg-accent-blue py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:bg-accent-blue/90">Get Started</button>
            </div>

            {/* Card 2: Continue Last Note (Static for now) */}
            <div className="relative flex flex-col justify-between gap-6 rounded-xl border border-border-light bg-card p-6 shadow-soft backdrop-blur-md transition-shadow hover:shadow-soft-hover">
              <div className="flex flex-col gap-3">
                <div className="flex size-12 items-center justify-center rounded-lg bg-accent-purple/10">
                  <span className="material-symbols-outlined text-accent-purple" style={{fontSize: '28px'}}>history_edu</span>
                </div>
                <h2 className="text-text-primary text-xl font-bold leading-normal">Pick Up Where You Left Off</h2>
                <p className="text-text-secondary text-sm font-normal leading-normal">Lecture 3: Quantum Physics</p>
              </div>
              <button className="w-full rounded-lg bg-accent-purple py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:bg-accent-purple/90">Continue Writing</button>
            </div>

            {/* Card 3: Create a Quiz */}
            <div className="relative flex flex-col justify-between gap-6 rounded-xl border border-border-light bg-card p-6 shadow-soft backdrop-blur-md transition-shadow hover:shadow-soft-hover">
              <div className="flex flex-col gap-3">
                <div className="flex size-12 items-center justify-center rounded-lg bg-accent-green/10">
                  <span className="material-symbols-outlined text-accent-green" style={{fontSize: '28px'}}>quiz</span>
                </div>
                <h2 className="text-text-primary text-xl font-bold leading-normal">Test Your Knowledge</h2>
                <p className="text-text-secondary text-sm font-normal leading-normal">Generate a practice quiz from any of your existing notes.</p>
              </div>
              <Link href="/quiz" className="w-full block text-center rounded-lg bg-accent-green py-2.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:bg-accent-green/90">Create Quiz</Link>
            </div>
          </div>

          {/* Your Courses Section */}
          <div>
            <h2 className="text-text-primary text-2xl font-bold mb-6">Your Courses</h2>
             <div className="px-0">
              {isLoading ? (
                 <div className="text-center py-10 text-text-secondary">Loading courses...</div>
              ) : courses.length === 0 ? (
                <div className="border-2 border-dashed border-border-light rounded-lg h-48 flex items-center justify-center bg-card">
                   <div className="text-center">
                      <p className="text-text-secondary mb-2">No courses found.</p>
                      <button onClick={() => setIsModalOpen(true)} className="text-accent-blue hover:underline font-medium">Create your first course</button>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <div 
                        key={course.id} 
                        onClick={() => router.push(`/dashboard/courses/${course.id}`)}
                        className="bg-card border border-border-light rounded-xl p-6 shadow-soft hover:shadow-soft-hover transition-all h-full flex flex-col cursor-pointer group"
                    >
                        <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center gap-3 flex-1 min-w-0">
                             <div className="flex items-center justify-center rounded-lg bg-primary/10 size-10 text-primary shrink-0">
                               <span className="material-symbols-outlined">book</span>
                             </div>
                             <div className="flex-1 min-w-0">
                                <EditableTitle 
                                    initialTitle={course.name} 
                                    onSave={async (newName) => handleUpdateCourse(course.id, newName)} 
                                    className="text-lg font-bold text-text-primary truncate block"
                                    inputClassName="text-lg font-bold w-full"
                                />
                             </div>
                           </div>
                           <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCourse(course.id);
                                }}
                                className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                                title="Delete Course"
                           >
                                <Trash2 size={20} />
                           </button>
                        </div>
                        <div className="mt-auto">
                           <p className="text-xs text-text-secondary">
                             Created: {new Date(course.created_at).toLocaleDateString()}
                           </p>
                        </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <CreateCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCourseCreated={handleCourseCreated}
      />
      
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteCourse}
        title="Delete Course"
        message="Are you sure you want to delete this course? All notes related to this course will be deleted too."
        isLoading={isDeleting}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
