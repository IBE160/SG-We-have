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

  it('renders note details when note exists', async () => {
    render(<NoteDetailsPage />);

    expect(await screen.findByText('Test Note Title')).toBeInTheDocument();
  });
});