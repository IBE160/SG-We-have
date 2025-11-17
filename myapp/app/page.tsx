"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Course } from '@/lib/types';
import Modal from '@/app/components/Modal';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const fetchCourses = async () => {
    const res = await fetch('/api/courses');
    const data = await res.json();
    setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async () => {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newCourseTitle }),
    });
          if (res.ok) {
            setNewCourseTitle('');
            setIsCreateModalOpen(false);
            fetchCourses(); // Refresh the list
            console.log('Course created successfully!');
          } else {
            console.error('Error creating course!');
          }  };

  const handleDeleteCourse = async () => {
    if (courseToDelete) {
      const res = await fetch(`/api/courses/${courseToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setCourseToDelete(null);
        fetchCourses(); // Refresh the list
        console.log('Course deleted successfully!');
      } else {
        console.error('Error deleting course!');
      }
    }
  };

  return (
    <main className="mockup-main">
      <div className="mockup-page-header">
        <h1>My Courses</h1>
        <button className="mockup-button mockup-button-primary" onClick={() => setIsCreateModalOpen(true)}>+ New Course</button>
      </div>
      <div className="course-list">
        {courses.map((course) => (
          <div className="course-list-item" key={course.id}>
            <div className="course-info">
              <h2>{course.title}</h2>
            </div>
            <div>
              <Link href={`/course/${course.id}`}>
                <button className="mockup-button mockup-button-outline mr-2">View Course</button>
              </Link>
              <button
                className="mockup-button mockup-button-outline"
                onClick={() => {
                  setCourseToDelete(course);
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Course">
        <input
          type="text"
          placeholder="Course Title"
          className="mockup-input"
          value={newCourseTitle}
          onChange={(e) => setNewCourseTitle(e.target.value)}
        />
        <button className="mockup-button mockup-button-primary mt-4" onClick={handleCreateCourse}>Create</button>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Course">
        <p>Are you sure you want to delete &quot;{courseToDelete?.title}&quot;?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button className="mockup-button mockup-button-outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          <button className="mockup-button mockup-button-primary" onClick={handleDeleteCourse}>Delete</button>
        </div>
      </Modal>
    </main>
  );
}
