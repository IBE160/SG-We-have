'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CreateCourseModal from '@/components/CreateCourseModal';
import { getCourses, Course, ApiError } from '@/lib/api';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    setTimeout(() => setSuccessMessage(null), 3000); // Clear after 3 seconds
    fetchCourses();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Course
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
          
          <div className="px-4 py-6 sm:px-0">
            {isLoading ? (
               <div className="text-center py-10">Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
                 <div className="text-center">
                    <p className="text-gray-500 mb-2">No courses found.</p>
                    <button onClick={() => setIsModalOpen(true)} className="text-blue-600 hover:underline">Create your first course</button>
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <Link key={course.id} href={`/dashboard/courses/${course.id}`} className="block">
                    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow h-full">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 truncate">
                          {course.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Created: {new Date(course.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <CreateCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCourseCreated={handleCourseCreated}
      />
    </div>
  );
}
