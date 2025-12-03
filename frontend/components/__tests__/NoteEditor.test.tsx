import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NoteEditor from '../NoteEditor'

// Mock Tiptap hooks and extensions to avoid complex DOM manipulation in tests
jest.mock('@tiptap/react', () => ({
  useEditor: jest.fn(() => ({
    chain: jest.fn(() => ({
      focus: jest.fn(() => ({
        toggleBold: jest.fn(() => ({ run: jest.fn() })),
        toggleItalic: jest.fn(() => ({ run: jest.fn() })),
        toggleHeading: jest.fn(() => ({ run: jest.fn() })),
        toggleBulletList: jest.fn(() => ({ run: jest.fn() })),
        toggleOrderedList: jest.fn(() => ({ run: jest.fn() })),
        run: jest.fn(),
      })),
    })),
    isActive: jest.fn((name, attributes) => {
        if (name === 'bold') return false;
        if (name === 'heading' && attributes?.level === 1) return false;
        return false;
    }),
    getHTML: jest.fn(() => '<p>Test Content</p>'),
    commands: {
        setContent: jest.fn()
    }
  })),
  EditorContent: () => <div data-testid="editor-content" />,
}))

describe('NoteEditor Component', () => {
  it('renders the toolbar with all formatting buttons', () => {
    render(<NoteEditor initialContent="" />)

    expect(screen.getByTitle('Bold')).toBeInTheDocument()
    expect(screen.getByTitle('Italic')).toBeInTheDocument()
    expect(screen.getByTitle('Heading 1')).toBeInTheDocument()
    expect(screen.getByTitle('Heading 2')).toBeInTheDocument()
    expect(screen.getByTitle('Heading 3')).toBeInTheDocument()
    expect(screen.getByTitle('Bullet List')).toBeInTheDocument()
    expect(screen.getByTitle('Ordered List')).toBeInTheDocument()
  })

  it('renders the editor content area', () => {
      render(<NoteEditor initialContent="" />)
      expect(screen.getByTestId('editor-content')).toBeInTheDocument()
  })

  it('renders the Save button when onSave is provided', () => {
    render(<NoteEditor initialContent="" onSave={jest.fn()} />)
    expect(screen.getByTitle('Save Notes')).toBeInTheDocument()
  })

  it('calls onSave when Save button is clicked', async () => {
    const mockOnSave = jest.fn().mockResolvedValue(undefined)
    render(<NoteEditor initialContent="" onSave={mockOnSave} />)
    
    fireEvent.click(screen.getByTitle('Save Notes'))
    
    await waitFor(() => expect(mockOnSave).toHaveBeenCalled())
  })

  it('shows "Saving..." while save is in progress', async () => {
    const mockOnSave = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<NoteEditor initialContent="" onSave={mockOnSave} />)
    
    fireEvent.click(screen.getByTitle('Save Notes'))
    
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    
    await waitFor(() => expect(mockOnSave).toHaveBeenCalled())
  })

  it('shows success message after successful save', async () => {
    jest.useFakeTimers(); // Use fake timers to control setTimeout
    const mockOnSave = jest.fn().mockResolvedValue(undefined)
    render(<NoteEditor initialContent="" onSave={mockOnSave} />)
    
    fireEvent.click(screen.getByTitle('Save Notes'))
    
    await waitFor(() => {
        expect(screen.getByText('Notes saved successfully!')).toBeInTheDocument()
    })
    
    jest.runAllTimers(); // Advance timers to clear the message
    await waitFor(() => {
        expect(screen.queryByText('Notes saved successfully!')).not.toBeInTheDocument();
    });

    jest.useRealTimers(); // Restore real timers
  })

  it('shows error message when save fails', async () => {
    const mockOnSave = jest.fn().mockRejectedValue(new Error('Failed'))
    render(<NoteEditor initialContent="" onSave={mockOnSave} />)
    
    fireEvent.click(screen.getByTitle('Save Notes'))
    
    await waitFor(() => {
        expect(screen.getByText('Failed to save notes. Please try again.')).toBeInTheDocument()
    })
  })

  it('renders the lastSavedAt timestamp when provided', () => {
    const date = new Date('2023-01-01T12:00:00Z')
    render(<NoteEditor initialContent="" lastSavedAt={date.toISOString()} />)
    
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument()
  })

  it('does not render timestamp when lastSavedAt is null', () => {
    render(<NoteEditor initialContent="" lastSavedAt={null} />)
    expect(screen.queryByText(/Last updated:/)).not.toBeInTheDocument()
  })
})

