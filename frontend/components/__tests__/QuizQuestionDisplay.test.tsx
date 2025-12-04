import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizQuestionDisplay } from '../QuizQuestionDisplay';
import { QuestionDisplay, QuizSubmissionResponse } from '../../lib/services/quiz';

const mockQuestion: QuestionDisplay = {
  id: 'q1',
  question_text: 'What is the capital of France?',
  options: [
    { id: 'o1', option_text: 'London', option_index: 0 },
    { id: 'o2', option_text: 'Paris', option_index: 1 },
    { id: 'o3', option_text: 'Berlin', option_index: 2 },
  ]
};

describe('QuizQuestionDisplay', () => {
  it('renders question and options', () => {
    render(<QuizQuestionDisplay question={mockQuestion} />);
    
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
  });

  it('calls onAnswerSelect when an option is clicked', () => {
    const mockSelect = jest.fn();
    render(<QuizQuestionDisplay question={mockQuestion} onAnswerSelect={mockSelect} />);
    
    fireEvent.click(screen.getByText('Paris'));
    expect(mockSelect).toHaveBeenCalledWith('o2');
  });

  it('displays correct feedback when answered correctly', () => {
    const mockResult: QuizSubmissionResponse = {
      is_correct: true,
      correct_answer_id: 'o2',
      feedback_text: 'You got it right!'
    };

    render(
      <QuizQuestionDisplay 
        question={mockQuestion} 
        selectedOptionId="o2"
        isAnswered={true}
        submissionResult={mockResult}
      />
    );

    expect(screen.getByText('Correct!')).toBeInTheDocument();
    expect(screen.getByText('You got it right!')).toBeInTheDocument();
    
    // Check for green styling (tailwind class check might be brittle, but let's try to find the button)
    const correctButton = screen.getByText('Paris').closest('button');
    expect(correctButton).toHaveClass('border-green-500'); 
  });

  it('displays incorrect feedback when answered incorrectly', () => {
    const mockResult: QuizSubmissionResponse = {
      is_correct: false,
      correct_answer_id: 'o2',
      feedback_text: 'Incorrect. The correct answer was Paris.'
    };

    render(
      <QuizQuestionDisplay 
        question={mockQuestion} 
        selectedOptionId="o1"
        isAnswered={true}
        submissionResult={mockResult}
      />
    );

    expect(screen.getByText('Incorrect')).toBeInTheDocument();
    expect(screen.getByText('Incorrect. The correct answer was Paris.')).toBeInTheDocument();

    const wrongButton = screen.getByText('London').closest('button');
    expect(wrongButton).toHaveClass('border-red-500'); 
    
    // Wait, logic says correct button is also highlighted if we wanted? 
    // Current logic: 
    // if (isAnswered) {
    //   if (isCorrect) ... (option.id == submissionResult.correct_answer_id)
    //   ...
    
    const correctButton = screen.getByText('Paris').closest('button');
    expect(correctButton).toHaveClass('border-green-500');
  });
  
  it('disables interaction when answered', () => {
    const mockSelect = jest.fn();
    render(
      <QuizQuestionDisplay 
        question={mockQuestion} 
        onAnswerSelect={mockSelect}
        isAnswered={true}
        submissionResult={{ is_correct: true, correct_answer_id: 'o1', feedback_text: 'ok' }}
      />
    );
    
    fireEvent.click(screen.getByText('Paris'));
    expect(mockSelect).not.toHaveBeenCalled();
  });
});
