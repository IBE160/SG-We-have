"use client";

import Link from 'next/link';
import { notes } from '@/lib/notes';
import { courses } from '@/lib/courses';
import { useState } from 'react';

export default function QuizListPage() {
  const quizzes = notes;

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
  }, {} as Record<string, (typeof courses[0] & { quizzes: typeof quizzes })> );

  const [openCourse, setOpenCourse] = useState<string | null>(null);

  const toggleCourse = (courseId: string) => {
    setOpenCourse(openCourse === courseId ? null : courseId);
  };

  return (
    <div className="mockup-body">
      <header className="mockup-header">
        <div className="mockup-logo">ibe160</div>
        <div className="mockup-user-profile">
          <span>Focused Fiona</span>
          <div className="mockup-user-avatar">FF</div>
        </div>
      </header>
      <main className="mockup-main">
        <div className="mockup-page-header">
          <h1>My Quizzes</h1>
          <Link href="/course/general/editor">
            <button className="mockup-button mockup-button-primary">+ Create New Quiz</button>
          </Link>
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
                      <Link href={`/course/${quiz.courseId}/editor?noteId=${quiz.id}`}>
                        <button className="mockup-button mockup-button-outline">Edit Quiz</button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
