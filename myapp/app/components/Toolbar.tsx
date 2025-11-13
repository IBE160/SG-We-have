"use client";

import { type Editor } from "@tiptap/react";
import { useState, useCallback } from "react";

type Props = {
  editor: Editor | null;
};

const HIGHLIGHT_COLORS = ['#FFFF00', '#ADFF2F', '#ADD8E6']; // Yellow, GreenYellow, LightBlue

export const Toolbar = ({ editor }: Props) => {
  const [isHighlightPopoverOpen, setIsHighlightPopoverOpen] = useState(false);

  const setLink = useCallback(() => {
    if (!editor) {
      return;
    }
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="p-2 border-b border-gray-300 bg-gray-50">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          title="Undo"
        >
          <span>↩️</span>
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          title="Redo"
        >
          <span>↪️</span>
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded-md ${editor.isActive("bold") ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded-md ${editor.isActive("italic") ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded-md ${editor.isActive("strike") ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Strikethrough"
        >
          <span className="line-through">S</span>
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-md ${editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Heading 1"
        >
          <span className="font-bold">H1</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-md ${editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Heading 2"
        >
          <span className="font-bold">H2</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-md ${editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Heading 3"
        >
          <span className="font-bold">H3</span>
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded-md ${editor.isActive("paragraph") ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Paragraph"
        >
          <span>P</span>
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-md ${editor.isActive("bulletList") ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Bullet List"
        >
          <span>•</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-md ${editor.isActive("orderedList") ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Ordered List"
        >
          <span>1.</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-md ${editor.isActive("blockquote") ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Blockquote"
        >
          <span>“</span>
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <div className="relative">
          <button
            onClick={() => setIsHighlightPopoverOpen(!isHighlightPopoverOpen)}
            className={`p-2 rounded-md ${editor.isActive("highlight") ? "bg-gray-300" : "hover:bg-gray-200"}`}
            title="Highlight"
          >
            <span style={{background: 'yellow'}}>H</span>
          </button>
          {isHighlightPopoverOpen && (
            <div className="absolute z-10 mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-lg flex flex-col gap-2">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color }).run();
                    setIsHighlightPopoverOpen(false);
                  }}
                  className={`w-8 h-8 rounded-md ${editor.isActive('highlight', { color }) ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              <button
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setIsHighlightPopoverOpen(false);
                }}
                className="text-sm text-gray-600 hover:text-black"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        <button
          onClick={setLink}
          className={`p-2 rounded-md ${editor.isActive('link') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Add Link"
        >
          <span>🔗</span>
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          title="Remove Link"
        >
          <span>🚫</span>
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-2 rounded-md hover:bg-gray-200"
          title="Insert Table"
        >
          <span>🗄️</span>
        </button>
        <button
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          disabled={!editor.can().addColumnBefore()}
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          title="Add Column Before"
        >
          <span>⬅️</span>
        </button>
        <button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!editor.can().addColumnAfter()}
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          title="Add Column After"
        >
          <span>➡️</span>
        </button>
        <button
          onClick={() => editor.chain().focus().addRowBefore().run()}
          disabled={!editor.can().addRowBefore()}
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          title="Add Row Before"
        >
          <span>⬆️</span>
        </button>
        <button
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={!editor.can().addRowAfter()}
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          title="Add Row After"
        >
          <span>⬇️</span>
        </button>
        <button
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={!editor.can().deleteColumn()}
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          title="Delete Column"
        >
          <span>❌C</span>
        </button>
        <button
          onClick={() => editor.chain().focus().deleteRow().run()}
          disabled={!editor.can().deleteRow()}
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          title="Delete Row"
        >
          <span>❌R</span>
        </button>
        <button
          onClick={() => editor.chain().focus().deleteTable().run()}
          disabled={!editor.can().deleteTable()}
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          title="Delete Table"
        >
          <span>❌T</span>
        </button>
      </div>
    </div>
  );
};
