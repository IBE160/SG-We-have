import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import LectureDetailsPage from '../[lectureId]/page'; // Adjust path as needed
import { getLectures, getLectureNotes, Lecture, Note, ApiError } from '@/lib/api';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock API functions
jest.mock('@/lib/api', () => ({
  getLectures: jest.fn(),
  getLectureNotes: jest.fn(),
  updateLectureNotes: jest.fn(),
  ApiError: class ApiError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ApiError';
    }
  },
}));

describe('LectureDetailsPage Integration', () => {
  const mockCourseId = 'course-123';
  const mockLectureId = 'lecture-456';
  const mockLecture: Lecture = {
    id: mockLectureId,
    course_id: mockCourseId,
    title: 'Test Lecture Title',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const mockNoteWithContent: Note = {
    id: 'note-789',
    lecture_id: mockLectureId,
    content: 'Some notes content for the test.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const mockNoteWithoutContent: Note = {
    id: 'note-empty',
    lecture_id: mockLectureId,
    content: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ courseId: mockCourseId, lectureId: mockLectureId });
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
    (getLectures as jest.Mock).mockResolvedValue([mockLecture]);
    (getLectureNotes as jest.Mock).mockResolvedValue(mockNoteWithContent);
    // Reset all mocks before each test to ensure isolation
    jest.clearAllMocks();
  });

  it('renders lecture details and Generate Quiz button when notes exist', async () => {
    (getLectureNotes as jest.Mock).mockResolvedValue(mockNoteWithContent);

    render(<LectureDetailsPage />);

    expect(await screen.findByText('Test Lecture Title')).toBeInTheDocument();
    expect(screen.getByText('Generate Quiz')).toBeInTheDocument();
  });

  it('opens QuizConfigModal when "Generate Quiz" button is clicked', async () => {
    (getLectureNotes as jest.Mock).mockResolvedValue(mockNoteWithContent);

    render(<LectureDetailsPage />);

    const generateQuizButton = await screen.findByText('Generate Quiz');
    fireEvent.click(generateQuizButton);

    expect(await screen.findByText('Configure Quiz')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Generate Quiz (Future)')).toBeInTheDocument();
  });

  it('closes QuizConfigModal when close button is clicked', async () => {
    (getLectureNotes as jest.Mock).mockResolvedValue(mockNoteWithContent);

    render(<LectureDetailsPage />);

    const generateQuizButton = await screen.findByText('Generate Quiz');
    fireEvent.click(generateQuizButton);

    const closeButton = await screen.findByRole('button', { name: '' }); // Close button has no accessible name
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Configure Quiz')).not.toBeInTheDocument();
    });
  });

  it('closes QuizConfigModal when Cancel button is clicked', async () => {
    (getLectureNotes as jest.Mock).mockResolvedValue(mockNoteWithContent);

    render(<LectureDetailsPage />);

    const generateQuizButton = await screen.findByText('Generate Quiz');
    fireEvent.click(generateQuizButton);

    const cancelButton = await screen.findByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Configure Quiz')).not.toBeInTheDocument();
    });
  });

  it('does not render "Generate Quiz" button if lecture content is null', async () => {
    (getLectureNotes as jest.Mock).mockResolvedValue(mockNoteWithoutContent);

    render(<LectureDetailsPage />);

    expect(await screen.findByText('Test Lecture Title')).toBeInTheDocument();
    expect(screen.queryByText('Generate Quiz')).not.toBeInTheDocument();
  });

  it('does not render "Generate Quiz" button if lecture content is empty string', async () => {
    const mockNoteEmptyContent = { ...mockNoteWithContent, content: '' };
    (getLectureNotes as jest.Mock).mockResolvedValue(mockNoteEmptyContent);

    render(<LectureDetailsPage />);

    expect(await screen.findByText('Test Lecture Title')).toBeInTheDocument();
    expect(screen.queryByText('Generate Quiz')).not.toBeInTheDocument();
  });
});
