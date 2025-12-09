'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Save } from 'lucide-react'
import clsx from 'clsx'

interface NoteEditorProps {
  initialContent?: string | null
  onUpdate?: (content: string) => void
  onSave?: (content: string) => Promise<void>
  lastSavedAt?: string | null
}

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  title,
  disabled = false,
  className = ''
}: {
  onClick: () => void
  isActive: boolean
  children: React.ReactNode
  title?: string
  disabled?: boolean
  className?: string
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={clsx(
      'p-2 rounded transition-colors',
      isActive ? 'bg-gray-200 text-black' : 'text-gray-500 hover:bg-gray-100',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )}
    type="button"
    title={title}
  >
    {children}
  </button>
)

const EditorToolbar = ({ editor, onSave, isSaving, lastSavedAt }: { editor: Editor, onSave?: () => void, isSaving?: boolean, lastSavedAt?: string | null }) => {
  if (!editor) return null

  return (
    <div className="sticky top-0 z-10 border-b p-2 flex gap-1 items-center flex-wrap bg-gray-50 rounded-t-md">
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

      <div className="ml-auto flex items-center gap-3">
        {lastSavedAt && (
            <span className="text-xs text-gray-500">
                Last updated: {new Date(lastSavedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
        )}
        {onSave && (
            <button
                onClick={onSave}
                disabled={isSaving}
                className={clsx(
                    'p-2 rounded transition-colors flex items-center gap-1',
                    isSaving ? 'text-gray-400 cursor-wait' : 'text-blue-600 hover:bg-blue-50'
                )}
                type="button"
                title="Save Notes"
            >
                <Save className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
        )}
      </div>
    </div>
  )
}

const NoteEditor = ({ initialContent, onUpdate, onSave, lastSavedAt }: NoteEditorProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm outline-none max-w-none min-h-[500px]',
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML())
      }
      setSaveStatus((prev) => (prev === 'success' || prev === 'error' ? 'idle' : prev))
    },
  })

  // Update content if initialContent changes (e.g. loaded from API)
  useEffect(() => {
    if (editor && initialContent !== undefined && initialContent !== null && editor.getHTML() !== initialContent) {
      // Only update if content is different to avoid cursor jumping or loops
      // Note: This comparison is simple and might not cover all cases, but works for initial load
       editor.commands.setContent(initialContent)
    }
  }, [initialContent, editor])

  const handleSave = async () => {
    if (!editor || !onSave) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
        await onSave(editor.getHTML());
        setSaveStatus('success');
        
        // Optional: Reset success message after a delay
        setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
        console.error('Failed to save note:', error);
        setSaveStatus('error');
    } finally {
        setIsSaving(false);
    }
  };

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-md bg-white shadow-sm flex flex-col">
      <EditorToolbar editor={editor} onSave={onSave ? handleSave : undefined} isSaving={isSaving} lastSavedAt={lastSavedAt} />
      
      {saveStatus === 'success' && (
         <div className="bg-green-50 text-green-700 px-4 py-1 text-xs text-center border-b border-green-100">
             Notes saved successfully!
         </div>
      )}
      
      {saveStatus === 'error' && (
         <div className="bg-red-50 text-red-700 px-4 py-1 text-xs text-center border-b border-red-100">
             Failed to save notes. Please try again.
         </div>
      )}

      <div className="p-4 min-h-[500px] cursor-text" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default NoteEditor