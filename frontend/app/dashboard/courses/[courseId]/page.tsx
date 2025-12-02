'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getCourses, getLectures, Course, Lecture, ApiError } from '@/lib/api';
import CreateLectureModal from '@/components/CreateLectureModal';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  // Handle params.courseId possibly being string | string[]
  // Renamed from params.id to params.courseId to match directory structure [courseId]
  const id = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

      // Fetch lectures
      const lectureData = await getLectures(id);
      setLectures(lectureData);
      
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

  const handleLectureCreated = () => {
    setSuccessMessage('Lecture added successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
    fetchData(); // Refresh list
  };

  if (!id) return <div className="p-10 text-center">Invalid Course ID</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
       <header className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 mr-4">
                    &larr; Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                    {course ? course.name : 'Loading...'}
                </h1>
            </div>
          {course && (
             <button
             onClick={() => setIsModalOpen(true)}
             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
           >
             Add Lecture
           </button>
          )}
        </div>
      </header>

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
            {lectures.length === 0 ? (
               <div className="p-6 text-center text-gray-500">
                 No lectures yet. Click "Add Lecture" to get started.
               </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {lectures.map((lecture) => (
                  <li key={lecture.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <Link href={`/dashboard/courses/${id}/lectures/${lecture.id}`} className="block">
                        <div className="flex items-center justify-between">
                        <p className="text-lg font-medium text-blue-600 truncate">{lecture.title}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {new Date(lecture.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      {course && (
        <CreateLectureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          courseId={course.id}
          onLectureCreated={handleLectureCreated}
        />
      )}
    </div>
  );
}
