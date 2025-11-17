import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');

  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        courseId: courseId || undefined,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ message: 'Error fetching quizzes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, courseId, questions, numberOfQuestions } = await request.json();

    let questionsToCreate = [];

    if (numberOfQuestions && numberOfQuestions > 0) {
      for (let i = 0; i < numberOfQuestions; i++) {
        questionsToCreate.push({
          text: `Question ${i + 1} for ${title}`,
          options: {
            create: [
              { text: 'Option A' },
              { text: 'Option B' },
            ],
          },
          // This will be updated after options are created
          correctOptionId: 'placeholder',
        });
      }
    } else if (questions) {
      questionsToCreate = questions.map((q: any) => ({
        text: q.text,
        correctOptionId: q.correctOptionId,
        options: {
          create: q.options.map((o: any) => ({
            text: o.text,
          })),
        },
      }));
    }

    const newQuiz = await prisma.quiz.create({
      data: {
        title,
        courseId,
        questions: {
          create: questionsToCreate,
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    // After creating the quiz and questions, update correctOptionId for generated questions
    if (numberOfQuestions && numberOfQuestions > 0 && newQuiz.questions.length > 0) {
      for (const question of newQuiz.questions) {
        if (question.options.length > 0) {
          await prisma.question.update({
            where: { id: question.id },
            data: { correctOptionId: question.options[0].id },
          });
        }
      }
      // Re-fetch the quiz to get updated correctOptionId
      const updatedQuiz = await prisma.quiz.findUnique({
        where: { id: newQuiz.id },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      });
      return NextResponse.json(updatedQuiz, { status: 201 });
    }

    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ message: 'Error creating quiz' }, { status: 500 });
  }
}
