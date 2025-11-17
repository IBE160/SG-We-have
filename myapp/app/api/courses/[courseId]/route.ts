import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ courseId: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { courseId } = resolvedParams;
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        notes: true,
        quizzes: true,
      },
    });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ message: 'Error fetching course' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ courseId: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { courseId } = resolvedParams;
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });
    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ message: 'Error deleting course' }, { status: 500 });
  }
}
