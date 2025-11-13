import Link from 'next/link';
import { courses } from '../lib/courses';

export default function Home() {
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
          <h1>My Courses</h1>
          <button className="mockup-button mockup-button-primary">+ New Course</button>
        </div>
        <div className="course-list">
          {courses.map((course) => (
            <div className="course-list-item" key={course.id}>
              <div className="course-info">
                <h2>{course.title}</h2>
                <p>{course.lectures} Lectures • Last updated: {course.lastUpdated}</p>
              </div>
              <Link href={`/course/${course.id}`}>
                <button className="mockup-button mockup-button-outline">View Course</button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
