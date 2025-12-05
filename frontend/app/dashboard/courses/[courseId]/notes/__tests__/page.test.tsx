import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import NoteDetailsPage from '../[noteId]/page'; 
import { getNote, updateNote, Note, ApiError } from '@/lib/api';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock API functions
jest.mock('@/lib/api', () => ({
  getNote: jest.fn(),
  updateNote: jest.fn(),
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

// Mock SupabaseClientProvider for AppHeader
jest.mock('@/components/SupabaseClientProvider', () => ({
  useAuth: jest.fn().mockReturnValue({ user: { email: 'test@example.com' } }),
}));

describe('NoteDetailsPage Integration', () => {
  const mockCourseId = 'course-123';
  const mockNoteId = 'note-456';
  const mockNote: Note = {
    id: mockNoteId,
    course_id: mockCourseId,
    title: 'Test Note Title',
    content: 'Some notes content for the test.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ courseId: mockCourseId, noteId: mockNoteId });
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
    (getNote as jest.Mock).mockResolvedValue(mockNote);
    // Reset all mocks before each test to ensure isolation
    jest.clearAllMocks();
  });

  it('renders note details and Generate Quiz button when note exists', async () => {
    render(<NoteDetailsPage />);

    expect(await screen.findByText('Test Note Title')).toBeInTheDocument();
    expect(screen.getByText('Generate Quiz')).toBeInTheDocument();
  });

  it('opens QuizConfigModal when "Generate Quiz" button is clicked', async () => {
    render(<NoteDetailsPage />);

    const generateQuizButton = await screen.findByText('Generate Quiz');
    fireEvent.click(generateQuizButton);

    expect(await screen.findByText('Configure Quiz')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    
    const buttons = screen.getAllByText('Generate Quiz');
    expect(buttons.length).toBeGreaterThan(1);
  });

  it('closes QuizConfigModal when close button is clicked', async () => {
    render(<NoteDetailsPage />);

    const generateQuizButton = await screen.findByText('Generate Quiz');
    fireEvent.click(generateQuizButton);

    const buttons = await screen.findAllByRole('button');
    // Filter out buttons that have text or a title (like the edit pencil button)
    // The modal close button has an SVG and no title attribute in the current implementation
    const closeButton = buttons.find(b => !b.textContent && !b.getAttribute('title'));
    
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
    render(<NoteDetailsPage />);

    const generateQuizButton = await screen.findByText('Generate Quiz');
    fireEvent.click(generateQuizButton);

    const cancelButton = await screen.findByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Configure Quiz')).not.toBeInTheDocument();
    });
  });
});