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

  it('renders course details and "Generate Quiz" button', async () => {
    render(<CourseDetailsPage />);

    expect(await screen.findByText('Test Course')).toBeInTheDocument();
    expect(screen.getByText('Lecture 1 Title')).toBeInTheDocument();
    expect(screen.getByText('Lecture 2 Title')).toBeInTheDocument();
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

    // Close button has no accessible name but is a button
    // We can find it by svg or class, or the one that is not 'Generate Quiz' or 'Add Lecture'
    // Or simpler: finding by role 'button' will return multiple.
    // The modal close button is usually the first one in the modal or identified by icon.
    // In the previous test code: `screen.findByRole('button', { name: '' })`
    // Let's stick to that if it worked, or make it more specific if needed.
    // Note: The modal close button has <svg>...
    
    // We can just use getAllByRole('button')[0] if we know the order, or try to match the SVG.
    // But let's assume the previous selector `screen.findByRole('button', { name: '' })` works for the X button.
    // However, "Add Lecture" and "Generate Quiz" have text.
    
    // Let's use a more robust selector if possible, or keep the existing one if valid.
    // The existing code used: `const closeButton = await screen.findByRole('button', { name: '' });`
    
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
