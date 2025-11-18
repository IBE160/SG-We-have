"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Modal from '@/app/components/Modal';

interface Course {
  id: string;
  title: string;
}

export default function CourseListPage() {
  // Load courses from localStorage on initial render, or use an empty array
  const [courses, setCourses] = useState<Course[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCourses = localStorage.getItem('courses');
      return savedCourses ? JSON.parse(savedCourses) : [];
    }
    return [];
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');

  // Save courses to localStorage whenever the courses state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('courses', JSON.stringify(courses));
    }
  }, [courses]);

  const handleCreateCourse = () => {
    if (newCourseTitle.trim()) {
      const newCourse: Course = {
        id: Date.now().toString(), // Simple unique ID
        title: newCourseTitle.trim(),
      };
      setCourses(prevCourses => [...prevCourses, newCourse]);
      setNewCourseTitle('');
      setIsCreateModalOpen(false);
    }
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
  };

  return (
    <main className="flex-1 p-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap justify-between gap-3 pb-8">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-text-primary text-4xl font-black leading-tight tracking-[-0.033em]">My Courses</h1>
            <p className="text-text-secondary text-lg font-normal leading-normal">Manage your study courses here.</p>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className="px-5 py-2.5 rounded-lg bg-secondary text-text-dark font-semibold transition hover:bg-secondary/80 flex items-center gap-2 shadow-md">
            <span className="material-symbols-outlined" style={{fontSize: '20px'}}>add_circle</span>
            New Course
          </button>
        </div>

        <div className="space-y-4">
          {courses.length === 0 ? (
            <p className="text-text-secondary">No courses yet. Click "New Course" to add one!</p>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-6 bg-white rounded-xl border border-border-light shadow-soft hover:shadow-soft-hover transition-shadow">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">{course.title}</h2>
                </div>
                <div className="flex gap-2">
                  <Link href={`/course/${course.id}`}>
                    <button className="px-5 py-2 rounded-lg bg-white border border-border-light text-text-primary font-semibold transition hover:bg-gray-50">View Notes</button>
                  </Link>
                  <button onClick={() => handleDeleteCourse(course.id)} className="px-5 py-2 rounded-lg bg-red-500 text-white font-semibold transition hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Course">
        <input
          type="text"
          placeholder="Course Title"
          className="form-input w-full rounded-lg border-border-light focus:ring-2 focus:ring-primary/50 focus:border-primary/50 h-12 px-4"
          value={newCourseTitle}
          onChange={(e) => setNewCourseTitle(e.target.value)}
        />
        <button className="w-full mt-4 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90" onClick={handleCreateCourse}>Create</button>
      </Modal>
    </main>
  );
}
