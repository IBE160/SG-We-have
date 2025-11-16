"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import QuestionBlock from './QuestionBlock';
import Cloze from './ClozeMark';
import AnswerBlock from './AnswerBlock';
import { Toolbar } from "./Toolbar";
import { SlashCommand } from "./slash-command-extension";
import { useSearchParams } from 'next/navigation';
import { notes } from '@/lib/notes'; // Import notes directly
import { useEffect } from "react";


// Import individual extensions
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Strike from '@tiptap/extension-strike';



import "./editor.css";

type TiptapProps = {
  courseId: string;
};

const Tiptap = ({ courseId }: TiptapProps) => {
  const searchParams = useSearchParams();
  const noteId = searchParams.get('noteId');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        strike: false, // Keep this false as Strike is added separately
        paragraph: false, // Disable default paragraph to use custom one
        link: false, // Disable default link to use custom one
      }),
      SlashCommand, // Use custom slash command extension
      QuestionBlock,
      AnswerBlock,
      Cloze,
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose',
        },
        itemTypeName: 'taskItem',
      }),
      TaskItem,
      Table, // Add default Table extension
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }), // Configure Highlight for multicolor
      Link.configure({
        openOnClick: false,
      }),
      Superscript,
      Subscript,
      Strike,
    ],
    content: `
      <h2>
        Text Highlighting
      </h2>
      <p>
        This is some <mark style="background-color: yellow;">highlighted text</mark> in yellow.
      </p>
      <p>
        And this is <mark style="background-color: #ADFF2F;">another highlight</mark> in green.
      </p>
      <p>
        You can now highlight text using the bubble menu.
      </p>
    `,
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
    },
  });

  useEffect(() => {
    if (editor && noteId) {
      const existingNote = notes.find(note => note.id === noteId);
      if (existingNote) {
        editor.commands.setContent(existingNote.content);
      }
    }
  }, [editor, noteId]);

  const saveNote = async () => {
    if (!editor) {
      return;
    }

    const title = editor.getText().split('\n')[0] || 'New Note'; // Get first line as title
    const content = editor.getHTML();
    
    if (noteId) {
      // Update existing note
      const noteIndex = notes.findIndex(note => note.id === noteId);
      if (noteIndex > -1) {
        notes[noteIndex] = { ...notes[noteIndex], title, content };
      }
      alert('Note updated successfully!');
    } else {
      // Create new note
      const id = `${courseId}-${Date.now()}`; // Simple unique ID
      const newNote = {
        id,
        courseId,
        title,
        content,
      };
      notes.push(newNote);
      alert('Note saved successfully!');
    }
  };

  return (
    <div className="border border-gray-300 rounded-md">
      <Toolbar editor={editor} onSave={saveNote} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;