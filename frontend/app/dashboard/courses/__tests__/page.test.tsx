import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import CourseDetailsPage from '../[courseId]/page';
import { getCourses, getLectures, Course, Lecture, ApiError } from '@/lib/api';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock API functions
jest.mock('@/lib/api', () => ({
  getCourses: jest.fn(),
  getLectures: jest.fn(),
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
  };
  const mockLectures: Lecture[] = [
    {
      id: 'lecture-1',
      course_id: mockCourseId,
      title: 'Lecture 1 Title',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'lecture-2',
      course_id: mockCourseId,
      title: 'Lecture 2 Title',
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
    (getLectures as jest.Mock).mockResolvedValue(mockLectures);
    jest.clearAllMocks();
  });

  it('renders course details and "Generate Quiz" buttons for each lecture', async () => {
    render(<CourseDetailsPage />);

    expect(await screen.findByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('Lecture 1 Title')).toBeInTheDocument();
    expect(screen.getByText('Lecture 2 Title')).toBeInTheDocument();
    expect(screen.getAllByText('Generate Quiz')).toHaveLength(mockLectures.length);
  });

  it('opens QuizConfigModal when a "Generate Quiz" button is clicked', async () => {
    render(<CourseDetailsPage />);

    const generateQuizButton = (await screen.findAllByText('Generate Quiz'))[0]; // Click the first one
    fireEvent.click(generateQuizButton);

    expect(await screen.findByText('Configure Quiz')).toBeInTheDocument();
  });

  it('closes QuizConfigModal when close button is clicked', async () => {
    render(<CourseDetailsPage />);

    const generateQuizButton = (await screen.findAllByText('Generate Quiz'))[0];
    fireEvent.click(generateQuizButton);

    const closeButton = await screen.findByRole('button', { name: '' }); // Close button has no accessible name
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Configure Quiz')).not.toBeInTheDocument();
    });
  });

  it('closes QuizConfigModal when Cancel button is clicked', async () => {
    render(<CourseDetailsPage />);

    const generateQuizButton = (await screen.findAllByText('Generate Quiz'))[0];
    fireEvent.click(generateQuizButton);

    const cancelButton = await screen.findByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Configure Quiz')).not.toBeInTheDocument();
    });
  });
});
