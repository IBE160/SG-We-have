import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import CourseDetailsPage from '../[courseId]/page';
import { getCourses, getNotes, Course, Note, ApiError } from '@/lib/api';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock API functions
jest.mock('@/lib/api', () => ({
  getCourses: jest.fn(),
  getNotes: jest.fn(),
  ApiError: class ApiError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ApiError';
    }
  },
}));

describe('CourseDetailsPage Integration', () => {
  const mockCourseId = 'course-123';
  const mockCourse: Course = {
    id: mockCourseId,
    name: 'Test Course',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-123'
  };
  const mockNotes: Note[] = [
    {
      id: 'note-1',
      course_id: mockCourseId,
      title: 'Note 1 Title',
      content: 'Content 1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'note-2',
      course_id: mockCourseId,
      title: 'Note 2 Title',
      content: 'Content 2',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ courseId: mockCourseId });
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
    (getCourses as jest.Mock).mockResolvedValue([mockCourse]);
    (getNotes as jest.Mock).mockResolvedValue(mockNotes);
    jest.clearAllMocks();
  });

  it('renders course details and "Generate Quiz" button', async () => {
    render(<CourseDetailsPage />);

    expect(await screen.findByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('Note 1 Title')).toBeInTheDocument();
    expect(screen.getByText('Note 2 Title')).toBeInTheDocument();
    // Expect single global button
    expect(screen.getByText('Generate Quiz')).toBeInTheDocument();
  });

  it('opens QuizConfigModal when "Generate Quiz" button is clicked', async () => {
    render(<CourseDetailsPage />);

    const generateQuizButton = await screen.findByText('Generate Quiz');
    fireEvent.click(generateQuizButton);

    expect(await screen.findByText('Configure Quiz')).toBeInTheDocument();
  });

  it('closes QuizConfigModal when close button is clicked', async () => {
    render(<CourseDetailsPage />);

    const generateQuizButton = await screen.findByText('Generate Quiz');
    fireEvent.click(generateQuizButton);

    const buttons = await screen.findAllByRole('button');
    // The X button typically has no text content, so name might be empty string.
    const closeButton = buttons.find(b => !b.textContent);
    
    if (closeButton) {
        fireEvent.click(closeButton);
    } else {
        throw new Error("Close button not found");
    }

    await waitFor(() => {
      expect(screen.queryByText('Configure Quiz')).not.toBeInTheDocument();
    });
  });

  it('closes QuizConfigModal when Cancel button is clicked', async () => {
    render(<CourseDetailsPage />);

    const generateQuizButton = await screen.findByText('Generate Quiz');
    fireEvent.click(generateQuizButton);

    const cancelButton = await screen.findByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Configure Quiz')).not.toBeInTheDocument();
    });
  });
});
