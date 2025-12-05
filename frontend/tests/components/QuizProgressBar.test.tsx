import { render, screen } from '@testing-library/react';
import { QuizProgressBar } from '../../components/QuizProgressBar';
import '@testing-library/jest-dom';

describe('QuizProgressBar', () => {
  it('renders correct question count text', () => {
    render(<QuizProgressBar currentQuestionIndex={0} totalQuestions={10} />);
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument();
  });

  it('renders correct percentage text', () => {
    render(<QuizProgressBar currentQuestionIndex={4} totalQuestions={10} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
  
  it('renders correct percentage text for 0 index', () => {
      // 1/10 = 10%
      render(<QuizProgressBar currentQuestionIndex={0} totalQuestions={10} />);
      expect(screen.getByText('10%')).toBeInTheDocument();
  });

  it('has progressbar role', () => {
    render(<QuizProgressBar currentQuestionIndex={0} totalQuestions={10} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('sets aria-valuenow correctly', () => {
    render(<QuizProgressBar currentQuestionIndex={4} totalQuestions={10} />); // 5th question of 10 -> 50%
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
  });
});
