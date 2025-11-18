import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        notes: {
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error(`Error fetching course with ID ${courseId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}