import { NextResponse } from 'next/server';
import { Quiz } from '@/lib/types';

const mockQuiz: Quiz = {
    id: '1',
    title: 'Programming Fundamentals Quiz',
    questions: [
        {
            id: '1',
            text: 'What is a variable?',
            options: [
                { id: '1', text: 'A container for storing data', isCorrect: true },
                { id: '2', text: 'A type of function', isCorrect: false },
            ],
        },
    ],
};

export async function GET(request: Request, context: { params: Promise<{ quizId: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { quizId } = resolvedParams;

    if (quizId !== '1') {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(mockQuiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ message: 'Error fetching quiz' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ quizId: string }> }) {
  try {
    return NextResponse.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json({ message: 'Error deleting quiz' }, { status: 500 });
  }
}
