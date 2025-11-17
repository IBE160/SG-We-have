import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ noteId: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { noteId } = resolvedParams;
    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
      },
    });

    if (!note) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json({ message: 'Error fetching note' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ noteId: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { noteId } = resolvedParams;
    const { title, content } = await request.json();
    const updatedNote = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        title,
        content,
      },
    });
    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ message: 'Error updating note' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ noteId: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { noteId } = resolvedParams;
    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ message: 'Error deleting note' }, { status: 500 });
  }
}
