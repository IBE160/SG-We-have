import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');

  try {
    const notes = await prisma.note.findMany({
      where: {
        courseId: courseId || undefined,
      },
    });
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ message: 'Error fetching notes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, courseId } = await request.json();
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        courseId,
      },
    });
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ message: 'Error creating note' }, { status: 500 });
  }
}