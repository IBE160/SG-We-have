import { NextResponse } from 'next/server';
import { Course } from '@/lib/types';

const mockCourse: Course = {
    id: '1',
    title: 'Introduction to Programming',
    description: 'A beginner-friendly course on the fundamentals of programming.',
    notes: [
        { id: '1', title: 'Getting Started', content: 'This is the first note.' },
        { id: '2', title: 'Variables and Data Types', content: 'This is the second note.' },
    ],
};

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;
  try {
    if (courseId !== '1') {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(mockCourse);
  } catch (error) {
    console.error(`Error fetching course with ID ${courseId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}