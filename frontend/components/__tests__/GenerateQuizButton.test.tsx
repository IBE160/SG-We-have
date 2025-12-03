import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import GenerateQuizButton from '../GenerateQuizButton';

describe('GenerateQuizButton Component', () => {
  it('renders with children text', () => {
    render(<GenerateQuizButton onClick={jest.fn()}>Generate Now</GenerateQuizButton>);
    expect(screen.getByText('Generate Now')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const mockOnClick = jest.fn();
    render(<GenerateQuizButton onClick={mockOnClick}>Generate</GenerateQuizButton>);
    
    fireEvent.click(screen.getByText('Generate'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnClick = jest.fn();
    render(<GenerateQuizButton onClick={mockOnClick} disabled>Generate</GenerateQuizButton>);
    
    const button = screen.getByText('Generate');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled(); // Ensure onClick is not called when disabled
  });

  it('is not disabled by default', () => {
    const mockOnClick = jest.fn();
    render(<GenerateQuizButton onClick={mockOnClick}>Generate</GenerateQuizButton>);
    
    const button = screen.getByText('Generate');
    expect(button).not.toBeDisabled();
    
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
