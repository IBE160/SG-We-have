import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import GenerateQuizPage from '../../app/quiz/page';
import * as api from '../../lib/api';
import { useAuth } from '../../components/SupabaseClientProvider';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../lib/api', () => ({
  getCourses: jest.fn(),
  getNotes: jest.fn(),
  generateQuiz: jest.fn(),
  ApiError: class ApiError extends Error { constructor(msg: string) { super(msg); } }
}));

jest.mock('../../components/SupabaseClientProvider', () => ({
  useAuth: jest.fn(),
}));

describe('GenerateQuizPage', () => {
  const mockCourses = [
    { id: 'course-1', name: 'Math 101', created_at: '', user_id: 'user-1' },
    { id: 'course-2', name: 'Science 102', created_at: '', user_id: 'user-1' },
  ];
  
  const mockNotes = [
    { id: 'note-1', course_id: 'course-1', title: 'Algebra', content: 'Algebra content', created_at: '', updated_at: '' },
    { id: 'note-2', course_id: 'course-1', title: 'Geometry', content: 'Geometry content', created_at: '', updated_at: '' },
    { id: 'note-3', course_id: 'course-1', title: 'Empty Note', content: '', created_at: '', updated_at: '' }, // No content
  ];

  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: { email: 'test@example.com' } });
    (api.getCourses as jest.Mock).mockResolvedValue(mockCourses);
    (api.getNotes as jest.Mock).mockResolvedValue(mockNotes);
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it('renders the page and fetches courses', async () => {
    render(<GenerateQuizPage />);
    
    const texts = screen.getAllByText('Generate Quiz');
    expect(texts.length).toBeGreaterThanOrEqual(2); 
    
    await waitFor(() => {
      expect(api.getCourses).toHaveBeenCalled();
    });

    // Check if courses are loaded into the dropdown
    await waitFor(() => {
      expect(screen.getByDisplayValue('Math 101')).toBeInTheDocument();
    });
  });

  it('loads notes when a course is selected', async () => {
    render(<GenerateQuizPage />);
    
    await waitFor(() => {
      expect(api.getCourses).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(api.getNotes).toHaveBeenCalledWith('course-1');
    });

    expect(screen.getByText('Algebra')).toBeInTheDocument();
    expect(screen.getByText('Geometry')).toBeInTheDocument();
  });

  it('allows selecting quiz length', async () => {
    render(<GenerateQuizPage />);
    
    // Wait for rendering
    await waitFor(() => expect(api.getCourses).toHaveBeenCalled());
    
    const lengthSelect = screen.getByDisplayValue('10 Questions');
    expect(lengthSelect).toBeInTheDocument();

    fireEvent.change(lengthSelect, { target: { value: '20' } });
    
    expect(screen.getByDisplayValue('20 Questions')).toBeInTheDocument();
  });

  it('generates quiz with selected parameters', async () => {
    (api.generateQuiz as jest.Mock).mockResolvedValue({ id: 'new-quiz-id' });

    render(<GenerateQuizPage />);

    // Wait for notes to load
    await waitFor(() => expect(screen.getByText('Algebra')).toBeInTheDocument());

    // Select a note
    const noteCheckbox = screen.getByLabelText(/Algebra/i); // Matches the label containing "Algebra"
    fireEvent.click(noteCheckbox);

    // Change quiz length
    const lengthSelect = screen.getByDisplayValue('10 Questions');
    fireEvent.change(lengthSelect, { target: { value: '5' } });

    // Click generate button. 
    // The text is "Generate Quiz", but since there are multiple, use the button role.
    const generateButton = screen.getByRole('button', { name: 'Generate Quiz' });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(api.generateQuiz).toHaveBeenCalledWith(['note-1'], 5);
    });
    
    expect(pushMock).toHaveBeenCalledWith('/quiz/new-quiz-id');
  });
});
