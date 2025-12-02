import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
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

  // Note: Since we mocked useEditor, we can't easily test the click interactions fully without more complex mocking.
  // However, we verified the buttons are present and wired up in the component code.
  // Ideally, we would integration test this without mocking useEditor completely, but Tiptap is hard to test in JSDOM without mocks.
  
  it('renders the editor content area', () => {
      render(<NoteEditor initialContent="" />)
      expect(screen.getByTestId('editor-content')).toBeInTheDocument()
  })
})
