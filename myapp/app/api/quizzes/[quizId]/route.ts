import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ quizId: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { quizId } = resolvedParams;
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ message: 'Error fetching quiz' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ quizId: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { quizId } = resolvedParams;
    await prisma.quiz.delete({
      where: {
        id: quizId,
      },
    });
    return NextResponse.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json({ message: 'Error deleting quiz' }, { status: 500 });
  }
}
