import { NextResponse } from 'next/server';
import { Quiz } from '@/lib/types';

const mockQuizzes: Quiz[] = [
    {
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
    },
];

export async function GET(request: Request) {
  try {
    return NextResponse.json(mockQuizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ message: 'Error fetching quizzes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newQuiz: Quiz = {
        id: (mockQuizzes.length + 1).toString(),
        title: body.title,
        questions: [],
    };
    mockQuizzes.push(newQuiz);
    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ message: 'Error creating quiz' }, { status: 500 });
  }
}
