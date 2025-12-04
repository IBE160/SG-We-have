import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizConfigModal from '../QuizConfigModal';
import { Note } from '@/lib/api';

describe('QuizConfigModal', () => {
  const mockNotes: Note[] = [
    { id: '1', title: 'Note 1', course_id: 'c1', created_at: '2023-01-01', content: 'Content', updated_at: '2023-01-01' },
    { id: '2', title: 'Note 2', course_id: 'c1', created_at: '2023-01-02', content: 'Content', updated_at: '2023-01-02' },
    { id: '3', title: 'Note 3', course_id: 'c1', created_at: '2023-01-03', content: 'Content', updated_at: '2023-01-03' },
  ];

  const mockOnGenerate = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnGenerate.mockClear();
    mockOnClose.mockClear();
  });

  it('renders nothing when not open', () => {
    render(<QuizConfigModal isOpen={false} onClose={mockOnClose} notes={mockNotes} onGenerate={mockOnGenerate} />);
    expect(screen.queryByText('Configure Quiz')).not.toBeInTheDocument();
  });

  it('renders correctly when open', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} notes={mockNotes} onGenerate={mockOnGenerate} />);
    expect(screen.getByText('Configure Quiz')).toBeInTheDocument();
    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
    expect(screen.getByText('Note 3')).toBeInTheDocument();
  });

  it('allows selecting notes', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} notes={mockNotes} onGenerate={mockOnGenerate} />);
    
    const checkbox1 = screen.getByRole('checkbox', { name: 'Note 1' });
    fireEvent.click(checkbox1);
    expect(checkbox1).toBeChecked();
    
    const generateBtn = screen.getByText('Generate Quiz');
    expect(generateBtn).toBeEnabled();
  });

  it('handles Select All and Deselect All', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} notes={mockNotes} onGenerate={mockOnGenerate} />);
    
    const selectAllBtn = screen.getByText('Select All');
    fireEvent.click(selectAllBtn);
    
    const checkbox1 = screen.getByRole('checkbox', { name: 'Note 1' });
    const checkbox3 = screen.getByRole('checkbox', { name: 'Note 3' });
    
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
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} notes={mockNotes} onGenerate={mockOnGenerate} />);
    
    const checkbox1 = screen.getByRole('checkbox', { name: 'Note 1' });
    fireEvent.click(checkbox1);
    
    const generateBtn = screen.getByText('Generate Quiz');
    fireEvent.click(generateBtn);
    
    expect(mockOnGenerate).toHaveBeenCalledWith(['1'], 10);
    expect(mockOnClose).toHaveBeenCalled();
  });
});