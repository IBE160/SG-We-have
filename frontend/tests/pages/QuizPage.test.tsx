import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import QuizPage from '../../app/quiz/[quizId]/page';
import * as QuizService from '../../lib/services/quiz';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({ quizId: 'quiz-123' }),
  useRouter: () => ({ back: jest.fn() }),
}));

// Mock the service
jest.mock('../../lib/services/quiz');

describe('QuizPage Integration', () => {
  const mockQuizStartData: QuizService.QuizStartResponse = {
    attempt_id: 'attempt-1',
    quiz_id: 'quiz-123',
    quiz_title: 'Test Quiz Title',
    total_questions: 5,
    current_question_index: 0,
    first_question: {
      id: 'q1',
      question_text: 'Integration Test Question?',
      options: [
        { id: 'o1', option_text: 'Option A', option_index: 0 },
        { id: 'o2', option_text: 'Option B', option_index: 1 },
        { id: 'o3', option_text: 'Option C', option_index: 2 },
        { id: 'o4', option_text: 'Option D', option_index: 3 },
      ],
    },
  };

  it('renders loading state initially', () => {
    (QuizService.startQuiz as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<QuizPage />);
    expect(screen.getByText('Loading quiz...')).toBeInTheDocument();
  });

  it('renders quiz data after successful fetch', async () => {
    (QuizService.startQuiz as jest.Mock).mockResolvedValue(mockQuizStartData);
    render(<QuizPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Quiz Title')).toBeInTheDocument();
      expect(screen.getByText('Integration Test Question?')).toBeInTheDocument();
      expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
    });
  });

  it('renders error state on fetch failure', async () => {
    (QuizService.startQuiz as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    render(<QuizPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });
});
