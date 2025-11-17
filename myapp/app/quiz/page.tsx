"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Course, Quiz } from '@/lib/types';
import Modal from '@/app/components/Modal';

type CourseWithQuizzes = Course & { quizzes: Quiz[] };

export default function QuizListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [selectedCourseIdForQuiz, setSelectedCourseIdForQuiz] = useState('');
  const [newQuizNumberOfQuestions, setNewQuizNumberOfQuestions] = useState(5);

  const fetchCourses = async () => {
    const res = await fetch('/api/courses');
    const data = await res.json();
    setCourses(data);
  };

  const fetchQuizzes = async () => {
    const res = await fetch('/api/quizzes');
    const data = await res.json();
    setQuizzes(data);
  };

  useEffect(() => {
    fetchCourses();
    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async () => {
    if (quizToDelete) {
      const res = await fetch(`/api/quizzes/${quizToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setQuizToDelete(null);
        fetchQuizzes(); // Refresh the list
        console.log('Quiz deleted successfully!');
      } else {
        console.error('Error deleting quiz!');
      }
    }
  };

  const handleCreateQuiz = async () => {
    if (!newQuizTitle || !selectedCourseIdForQuiz || newQuizNumberOfQuestions <= 0) {
      alert('Please enter a title, select a course, and specify a valid number of questions for the quiz.');
      return;
    }
    const res = await fetch('/api/quizzes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newQuizTitle, courseId: selectedCourseIdForQuiz, numberOfQuestions: newQuizNumberOfQuestions }),
    });
    if (res.ok) {
      setNewQuizTitle('');
      setSelectedCourseIdForQuiz('');
      setNewQuizNumberOfQuestions(5); // Reset to default
      setIsCreateQuizModalOpen(false);
      fetchQuizzes(); // Refresh the list
      console.log('Quiz created successfully!');
    } else {
      console.error('Error creating quiz!');
    }
  };

  const quizzesByCourse = quizzes.reduce((acc, quiz) => {
    const course = courses.find(c => c.id === quiz.courseId);
    if (course) {
      if (!acc[course.id]) {
        acc[course.id] = {
          ...course,
          quizzes: [],
        };
      }
      acc[course.id].quizzes.push(quiz);
    }
    return acc;
  }, {} as Record<string, CourseWithQuizzes>);

  const toggleCourse = (courseId: string) => {
    setOpenCourse(openCourse === courseId ? null : courseId);
  };

  return (
    <div className="mockup-body">
      <main className="mockup-main">
        <div className="mockup-page-header">
          <h1>My Quizzes</h1>
          <button className="mockup-button mockup-button-primary" onClick={() => setIsCreateQuizModalOpen(true)}>+ New Quiz</button>
        </div>
        <div className="course-list">
          {Object.values(quizzesByCourse).map((course) => (
            <div className="course-list-item" key={course.id}>
              <div className="course-info" onClick={() => toggleCourse(course.id)} style={{ cursor: 'pointer' }}>
                <h2>{course.title}</h2>
                <p>{course.quizzes.length} {course.quizzes.length === 1 ? 'Quiz' : 'Quizzes'}</p>
              </div>
              {openCourse === course.id && (
                <div className="quiz-list">
                  {course.quizzes.map((quiz) => (
                    <div className="course-list-item" key={quiz.id}>
                      <div className="course-info">
                        <h3>{quiz.title}</h3>
                      </div>
                      <div>
                        <Link href={`/quiz/${quiz.id}`}>
                          <button className="mockup-button mockup-button-outline mr-2">Take Quiz</button>
                        </Link>
                        <button
                          className="mockup-button mockup-button-outline"
                          onClick={() => {
                            setQuizToDelete(quiz);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Quiz">
        <p>Are you sure you want to delete &quot;{quizToDelete?.title}&quot;?</p>
        <div className="flex justify-end gap-2 mt-4">
          <button className="mockup-button mockup-button-outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          <button className="mockup-button mockup-button-primary" onClick={handleDeleteQuiz}>Delete</button>
        </div>
      </Modal>

      <Modal isOpen={isCreateQuizModalOpen} onClose={() => setIsCreateQuizModalOpen(false)} title="Create New Quiz">
        <input
          type="text"
          placeholder="Quiz Title"
          className="mockup-input mb-4"
          value={newQuizTitle}
          onChange={(e) => setNewQuizTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Number of Questions"
          className="mockup-input mb-4"
          value={newQuizNumberOfQuestions}
          onChange={(e) => setNewQuizNumberOfQuestions(parseInt(e.target.value))}
          min="1"
        />
        <select
          className="mockup-input"
          value={selectedCourseIdForQuiz}
          onChange={(e) => setSelectedCourseIdForQuiz(e.target.value)}
        >
          <option value="">Select a Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
        <button className="mockup-button mockup-button-primary mt-4" onClick={handleCreateQuiz}>Create</button>
      </Modal>
    </div>
  );
}
