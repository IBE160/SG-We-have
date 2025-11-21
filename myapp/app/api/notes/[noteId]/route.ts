import { NextResponse } from 'next/server';
import { Note } from '@/lib/types';

const mockNote: Note = {
    id: '1',
    title: 'Getting Started',
    content: 'This is the first note.',
};

export async function GET(request: Request, context: { params: Promise<{ noteId: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { noteId } = resolvedParams;
    
    if (noteId !== '1') {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(mockNote);
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json({ message: 'Error fetching note' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ noteId: string }> }) {
  try {
    return NextResponse.json({ message: 'Note updated successfully' });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ message: 'Error updating note' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ noteId: string }> }) {
  try {
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ message: 'Error deleting note' }, { status: 500 });
  }
}
