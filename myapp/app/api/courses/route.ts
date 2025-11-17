import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ message: 'Error fetching courses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    const newCourse = await prisma.course.create({
      data: {
        title,
      },
    });
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ message: 'Error creating course' }, { status: 500 });
  }
}
