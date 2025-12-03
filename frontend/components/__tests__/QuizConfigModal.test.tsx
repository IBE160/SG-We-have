import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizConfigModal from '../QuizConfigModal';
import { Lecture } from '@/lib/api';

describe('QuizConfigModal', () => {
  const mockLectures: Lecture[] = [
    { id: '1', title: 'Lecture 1', course_id: 'c1', created_at: '2023-01-01', has_notes: true },
    { id: '2', title: 'Lecture 2', course_id: 'c1', created_at: '2023-01-02', has_notes: false },
    { id: '3', title: 'Lecture 3', course_id: 'c1', created_at: '2023-01-03', has_notes: true },
  ];

  const mockOnGenerate = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnGenerate.mockClear();
    mockOnClose.mockClear();
  });

  it('renders nothing when not open', () => {
    render(<QuizConfigModal isOpen={false} onClose={mockOnClose} lectures={mockLectures} onGenerate={mockOnGenerate} />);
    expect(screen.queryByText('Configure Quiz')).not.toBeInTheDocument();
  });

  it('renders correctly when open', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} lectures={mockLectures} onGenerate={mockOnGenerate} />);
    expect(screen.getByText('Configure Quiz')).toBeInTheDocument();
    expect(screen.getByText('Lecture 1')).toBeInTheDocument();
    expect(screen.getByText('Lecture 2')).toBeInTheDocument();
    expect(screen.getByText('Lecture 3')).toBeInTheDocument();
  });

  it('disables lectures without notes', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} lectures={mockLectures} onGenerate={mockOnGenerate} />);
    
    const checkbox1 = screen.getByRole('checkbox', { name: 'Lecture 1' });
    const checkbox2 = screen.getByRole('checkbox', { name: 'Lecture 2' });
    
    expect(checkbox1).toBeEnabled();
    expect(checkbox2).toBeDisabled();
    expect(screen.getByText('No notes saved. Add notes to include in quiz.')).toBeInTheDocument();
  });

  it('allows selecting lectures', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} lectures={mockLectures} onGenerate={mockOnGenerate} />);
    
    const checkbox1 = screen.getByRole('checkbox', { name: 'Lecture 1' });
    fireEvent.click(checkbox1);
    expect(checkbox1).toBeChecked();
    
    const generateBtn = screen.getByText('Generate Quiz');
    expect(generateBtn).toBeEnabled();
  });

  it('handles Select All and Deselect All', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} lectures={mockLectures} onGenerate={mockOnGenerate} />);
    
    const selectAllBtn = screen.getByText('Select All');
    fireEvent.click(selectAllBtn);
    
    const checkbox1 = screen.getByRole('checkbox', { name: 'Lecture 1' });
    const checkbox3 = screen.getByRole('checkbox', { name: 'Lecture 3' });
    
    expect(checkbox1).toBeChecked();
    expect(checkbox3).toBeChecked();
    
    // Button should change text
    expect(screen.getByText('Deselect All')).toBeInTheDocument();
    
    // Click again to deselect
    fireEvent.click(screen.getByText('Deselect All'));
    expect(checkbox1).not.toBeChecked();
    expect(checkbox3).not.toBeChecked();
  });

  it('calls onGenerate with selected IDs', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} lectures={mockLectures} onGenerate={mockOnGenerate} />);
    
    const checkbox1 = screen.getByRole('checkbox', { name: 'Lecture 1' });
    fireEvent.click(checkbox1);
    
    const generateBtn = screen.getByText('Generate Quiz');
    fireEvent.click(generateBtn);
    
    expect(mockOnGenerate).toHaveBeenCalledWith(['1']);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
