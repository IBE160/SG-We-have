import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScoreCard } from '../ScoreCard';
import { QuizResultResponse } from '../../lib/services/quiz';

const mockResults: QuizResultResponse = {
  score: 8,
  total_questions: 10,
  percentage: 80.0,
  completed_at: new Date().toISOString()
};

describe('ScoreCard', () => {
  it('renders completion message and score', () => {
    render(
      <ScoreCard 
        results={mockResults} 
        onRetake={jest.fn()} 
        onBackToCourses={jest.fn()} 
      />
    );
    
    expect(screen.getByText('Quiz Completed!')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('calls onRetake when Retake button is clicked', () => {
    const mockRetake = jest.fn();
    render(
      <ScoreCard 
        results={mockResults} 
        onRetake={mockRetake} 
        onBackToCourses={jest.fn()} 
      />
    );
    
    const retakeButton = screen.getByText('Retake Quiz');
    fireEvent.click(retakeButton);
    expect(mockRetake).toHaveBeenCalledTimes(1);
  });

  it('calls onBackToCourses when Back button is clicked', () => {
    const mockBack = jest.fn();
    render(
      <ScoreCard 
        results={mockResults} 
        onRetake={jest.fn()} 
        onBackToCourses={mockBack} 
      />
    );
    
    const backButton = screen.getByText('Back to Courses');
    fireEvent.click(backButton);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('renders Review Answers button as disabled placeholder', () => {
    render(
      <ScoreCard 
        results={mockResults} 
        onRetake={jest.fn()} 
        onBackToCourses={jest.fn()} 
      />
    );
    
    const reviewButton = screen.getByText(/Review Answers/i);
    expect(reviewButton).toBeInTheDocument();
    expect(reviewButton.closest('button')).toBeDisabled();
  });
});
