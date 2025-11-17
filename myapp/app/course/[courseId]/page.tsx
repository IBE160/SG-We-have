import CoursePageClient from './CoursePageClient';

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const { courseId } = await params;

  return <CoursePageClient courseId={courseId} />;
}

