"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Course, Note } from '@/lib/types';
import Modal from '@/app/components/Modal';

interface CoursePageClientProps {
  courseId: string;
}

export default function CoursePageClient({ courseId }: CoursePageClientProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [courseNotes, setCourseNotes] = useState<Note[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const fetchCourse = async () => {
    const res = await fetch(`/api/courses/${courseId}`);
    const data = await res.json();
    setCourse(data);
  };

  const fetchNotes = async () => {
    const res = await fetch(`/api/notes?courseId=${courseId}`);
    const data = await res.json();
    setCourseNotes(data);
  };

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchNotes();
    }
  }, [courseId]);

  const handleDeleteNote = async () => {
    if (noteToDelete) {
      const res = await fetch(`/api/notes/${noteToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setNoteToDelete(null);
        fetchNotes(); // Refresh the list
        console.log('Note deleted successfully!');
      } else {
        console.error('Error deleting note!');
      }
    }
  };

  if (!course) {
    return (
      <main className="mockup-main">
        <h1>Loading course...</h1>
      </main>
    );
  }

  return (
    <main className="mockup-main">
      <div className="mockup-page-header">
        <h1>{course.title} Notes</h1>
        <Link href={`/course/${course.id}/editor`} passHref>
          <button className="mockup-button mockup-button-primary">+ Create Note</button>
        </Link>
      </div>
      <div className="note-list">
        {courseNotes.length === 0 ? (
          <p>No notes yet for this course. Click &quot;Create Note&quot; to add one!</p>
        ) : (
          courseNotes.map((note) => (
            <div className="course-list-item" key={note.id}>
              <div className="course-info">
                <h2>{note.title}</h2>
                <p>{note.content.substring(0, 100)}...</p>
              </div>
              <div>
                <Link href={`/course/${course.id}/editor?noteId=${note.id}`} passHref>
                  <button className="mockup-button mockup-button-outline mr-2">Edit Note</button>
                </Link>
                <button
                  className="mockup-button mockup-button-outline"
                  onClick={() => {
                    setNoteToDelete(note);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Note">
        <p>Are you sure you want to delete &quot;{noteToDelete?.title}&quot;?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button className="mockup-button mockup-button-outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          <button className="mockup-button mockup-button-primary" onClick={handleDeleteNote}>Delete</button>
        </div>
      </Modal>
    </main>
  );
}
