'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

interface NoteEditorProps {
  initialContent?: string | null
  onUpdate?: (content: string) => void
}

const NoteEditor = ({ initialContent, onUpdate }: NoteEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: initialContent || '',
    editorProps: {
        attributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
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
          editor.commands.setContent(initialContent)
      }
  }, [initialContent, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-md p-4 min-h-[500px] bg-white shadow-sm">
      <EditorContent editor={editor} />
    </div>
  )
}

export default NoteEditor
