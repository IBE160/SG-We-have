"use client";

import { type Editor } from "@tiptap/react";
import { useState, useCallback, useEffect } from "react"; // Import useEffect
import { LinkEditPopover } from "./LinkEditPopover"; // Import the new component

type Props = {
  editor: Editor | null;
  onSave?: () => void;
};

const HIGHLIGHT_COLORS = ['#FFFF00', '#ADFF2F', '#ADD8E6']; // Yellow, GreenYellow, LightBlue

export const Toolbar = ({ editor, onSave }: Props) => {
  const [isHighlightPopoverOpen, setIsHighlightPopoverOpen] = useState(false);
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false); // State for link popover

  const setLink = useCallback(() => {
    if (!editor) {
      return;
    }
    setIsLinkPopoverOpen(true); // Open the link popover
  }, [editor]);

  useEffect(() => {
    if (editor) {
      console.log("Toolbar Editor Initialized (Link Check):", editor);
      console.log("Can set Link:", editor.can().chain().focus().setLink({ href: 'test' }).run());
      console.log("Can unset Link:", editor.can().chain().focus().unsetLink().run());
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 p-2 border-b border-gray-300 bg-gray-50">
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
        {onSave && (
          <button
            onClick={onSave}
            className="p-2 rounded-md bg-secondary text-text-dark shadow-md hover:bg-secondary/80"
            title="Save Note"
          >
            <span>💾</span>
          </button>
        )}
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
        <div className="relative">
          <button
            onClick={setLink}
            className={`p-2 rounded-md ${editor.isActive('link') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
            title="Add Link"
          >
            <span>🔗</span>
          </button>
          {isLinkPopoverOpen && (
            <LinkEditPopover editor={editor} onClose={() => setIsLinkPopoverOpen(false)} />
          )}
        </div>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          title="Remove Link"
        >
          <span>🚫</span>
        </button>
        <div className="w-px h-6 bg-gray-300" />
        {/*
        <button
          onClick={() => editor.chain().focus().insertContent('<question-block></question-block>').run()}
          className="p-2 rounded-md hover:bg-gray-200"
          title="Add Question"
        >
          <span>❓</span>
        </button>
        <button
          onClick={() => editor.chain().focus().insertContent('<answer-block></answer-block>').run()}
          className="p-2 rounded-md hover:bg-gray-200"
          title="Add Answer"
        >
          <span>💡</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCloze().run()}
          className={`p-2 rounded-md ${editor.isActive("cloze") ? "bg-gray-300" : "hover:bg-gray-200"}`}
          title="Toggle Cloze"
        >
          <span>C</span>
        </button>
        */}
      </div>
    </div>
  );
};