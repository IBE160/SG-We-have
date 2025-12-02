'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered } from 'lucide-react'
import clsx from 'clsx'

interface NoteEditorProps {
  initialContent?: string | null
  onUpdate?: (content: string) => void
}

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  title
}: {
  onClick: () => void
  isActive: boolean
  children: React.ReactNode
  title?: string
}) => (
  <button
    onClick={onClick}
    className={clsx(
      'p-2 rounded hover:bg-gray-100 transition-colors',
      isActive ? 'bg-gray-200 text-black' : 'text-gray-500'
    )}
    type="button"
    title={title}
  >
    {children}
  </button>
)

const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  return (
    <div className="border-b p-2 flex gap-1 items-center flex-wrap bg-gray-50 rounded-t-md">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
    </div>
  )
}

const NoteEditor = ({ initialContent, onUpdate }: NoteEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML())
      }
    },
  })

  // Update content if initialContent changes (e.g. loaded from API)
  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      // Only update if content is different to avoid cursor jumping or loops
      // Note: This comparison is simple and might not cover all cases, but works for initial load
       editor.commands.setContent(initialContent)
    }
  }, [initialContent, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-md bg-white shadow-sm flex flex-col">
      <EditorToolbar editor={editor} />
      <div className="p-4 min-h-[500px] cursor-text" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default NoteEditor