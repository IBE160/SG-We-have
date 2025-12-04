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
  generateQuiz: jest.fn(),
  ApiError: class ApiError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ApiError';
    }
  },
}));

// Mock NoteEditor to avoid Tiptap/ProseMirror JSDOM issues
jest.mock('@/components/NoteEditor', () => {
  return function MockNoteEditor() {
    return <div data-testid="mock-note-editor">Note Editor</div>;
  };
});

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
    
    // There are two "Generate Quiz" texts now: the open button (hidden by modal overlay?) and the submit button inside modal.
    // screen.getAllByText('Generate Quiz') should return > 1
    const buttons = screen.getAllByText('Generate Quiz');
    expect(buttons.length).toBeGreaterThan(1);
  });

  it('closes QuizConfigModal when close button is clicked', async () => {
    (getLectureNotes as jest.Mock).mockResolvedValue(mockNoteWithContent);

    render(<LectureDetailsPage />);

    const generateQuizButton = await screen.findByText('Generate Quiz');
    fireEvent.click(generateQuizButton);

    // Find the close button (SVG inside button)
    const buttons = await screen.findAllByRole('button');
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
});
