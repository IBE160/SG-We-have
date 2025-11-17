"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import QuestionBlock from './QuestionBlock';
import Cloze from './ClozeMark';
import AnswerBlock from './AnswerBlock';
import { Toolbar } from "./Toolbar";
import { SlashCommand } from "./slash-command-extension";
import { useEffect } from "react";
import { Note } from '@/lib/types';
import { BubbleMenu as BubbleMenuExtension } from '@tiptap/extension-bubble-menu'; // Import the BubbleMenu extension


// Import individual extensions
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell'; // Corrected import for TableCell
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
  noteId?: string;
};

const Tiptap = ({ courseId, noteId }: TiptapProps) => {
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
      Superscript.configure(),
      Subscript.configure(),
      Strike,
      BubbleMenuExtension, // Add the BubbleMenu extension
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
      const fetchNote = async () => {
        const res = await fetch(`/api/notes/${noteId}`);
        const data: Note = await res.json();
        if (data) {
          editor.commands.setContent(data.content);
        }
      };
      fetchNote();
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
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        console.log('Note updated successfully!');
      } else {
        console.error('Error updating note!');
      }
    } else {
      // Create new note
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, courseId }),
      });
      if (res.ok) {
        console.log('Note saved successfully!');
      } else {
        console.error('Error saving note!');
      }
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