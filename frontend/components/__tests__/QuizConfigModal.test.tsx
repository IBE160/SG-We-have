import { render, screen, fireEvent } from '@testing-library/react';
import QuizConfigModal from '../QuizConfigModal';
import { Note } from '@/lib/api';
import '@testing-library/jest-dom';

const mockNotes: Note[] = [
  { id: '1', course_id: 'c1', title: 'Note 1', content: 'Content 1', created_at: '2023-01-01', updated_at: '2023-01-01' },
  { id: '2', course_id: 'c1', title: 'Note 2', content: '', created_at: '2023-01-02', updated_at: '2023-01-02' }, // Empty content
  { id: '3', course_id: 'c1', title: 'Note 3', content: 'Content 3', created_at: '2023-01-03', updated_at: '2023-01-03' },
];

const mockOnClose = jest.fn();
const mockOnGenerate = jest.fn();

describe('QuizConfigModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when closed', () => {
    render(<QuizConfigModal isOpen={false} onClose={mockOnClose} notes={mockNotes} onGenerate={mockOnGenerate} />);
    expect(screen.queryByText('Configure Quiz')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} notes={mockNotes} onGenerate={mockOnGenerate} />);
    expect(screen.getByText('Configure Quiz')).toBeInTheDocument();
  });

  it('displays list of notes', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} notes={mockNotes} onGenerate={mockOnGenerate} />);
    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
    expect(screen.getByText('Note 3')).toBeInTheDocument();
  });

  it('disables notes without content', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} notes={mockNotes} onGenerate={mockOnGenerate} />);
    const checkbox1 = screen.getByLabelText('Note 1');
    const checkbox2 = screen.getByLabelText('Note 2');
    
    expect(checkbox1).not.toBeDisabled();
    expect(checkbox2).toBeDisabled();
  });

  it('allows selecting notes', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} notes={mockNotes} onGenerate={mockOnGenerate} />);
    const checkbox1 = screen.getByLabelText('Note 1');
    
    fireEvent.click(checkbox1);
    expect(checkbox1).toBeChecked();
  });

  it('selects all available notes when Select All is clicked', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} notes={mockNotes} onGenerate={mockOnGenerate} />);
    const selectAllBtn = screen.getByText('Select All');
    
    fireEvent.click(selectAllBtn);
    
    expect(screen.getByLabelText('Note 1')).toBeChecked();
    expect(screen.getByLabelText('Note 3')).toBeChecked();
    expect(screen.getByLabelText('Note 2')).not.toBeChecked(); // Still disabled
  });

  it('calls onGenerate with selected ids', () => {
    render(<QuizConfigModal isOpen={true} onClose={mockOnClose} notes={mockNotes} onGenerate={mockOnGenerate} />);
    const checkbox1 = screen.getByLabelText('Note 1');
    fireEvent.click(checkbox1);
    
    const generateBtn = screen.getByText('Generate Quiz');
    fireEvent.click(generateBtn);
    
    expect(mockOnGenerate).toHaveBeenCalledWith(['1'], 10);
  });
});