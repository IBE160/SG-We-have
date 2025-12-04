import { render, screen, fireEvent } from '@testing-library/react';
import { QuizQuestionDisplay } from '../../components/QuizQuestionDisplay';
import { QuestionDisplay } from '../../lib/services/quiz';
import '@testing-library/jest-dom';

const mockQuestion: QuestionDisplay = {
  id: 'q1',
  question_text: 'What is React?',
  options: [
    { id: 'o1', option_text: 'A Library', option_index: 0 },
    { id: 'o2', option_text: 'A Framework', option_index: 1 },
    { id: 'o3', option_text: 'A Database', option_index: 2 },
    { id: 'o4', option_text: 'A Language', option_index: 3 },
  ],
};

describe('QuizQuestionDisplay', () => {
  it('renders question text', () => {
    render(<QuizQuestionDisplay question={mockQuestion} />);
    expect(screen.getByText('What is React?')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<QuizQuestionDisplay question={mockQuestion} />);
    expect(screen.getByText('A Library')).toBeInTheDocument();
    expect(screen.getByText('A Framework')).toBeInTheDocument();
    expect(screen.getByText('A Database')).toBeInTheDocument();
    expect(screen.getByText('A Language')).toBeInTheDocument();
  });

  it('calls onAnswerSelect when option clicked', () => {
    const mockSelect = jest.fn();
    render(<QuizQuestionDisplay question={mockQuestion} onAnswerSelect={mockSelect} />);
    
    fireEvent.click(screen.getByText('A Library'));
    expect(mockSelect).toHaveBeenCalledWith('o1');
  });
});
