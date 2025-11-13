import { courses } from '@/lib/courses';
import { notes } from '@/lib/notes';
import Link from 'next/link';

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const resolvedParams = await params;
  const course = courses.find((c) => c.id === (resolvedParams.courseId ?? '').toLowerCase());
  const courseNotes = notes.filter((note) => note.courseId === (resolvedParams.courseId ?? '').toLowerCase());

  if (!course) {
    return (
      <div className="mockup-body">
        <main className="mockup-main">
          <h1>Course not found for ID: {resolvedParams.courseId}</h1>
          <p>Please check the URL or go back to the <Link href="/">home page</Link>.</p>
        </main>
      </div>
    );
  }

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
                <Link href={`/course/${course.id}/note/${note.id}`} passHref>
                  <button className="mockup-button mockup-button-outline">View Note</button>
                </Link>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
