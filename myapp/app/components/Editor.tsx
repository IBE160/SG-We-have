"use client";

import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit"; // Removed StarterKit
import QuestionBlock from './QuestionBlock';
import Cloze from './ClozeMark';
import AnswerBlock from './AnswerBlock';
import { Toolbar } from "./Toolbar";
import { SlashCommand } from "./slash-command-extension";
import { useEffect } from "react";
import { BubbleMenu as BubbleMenuExtension } from '@tiptap/extension-bubble-menu';

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
import Paragraph from '@tiptap/extension-paragraph'; // Explicitly import Paragraph
import Bold from '@tiptap/extension-bold'; // Explicitly import Bold
import Italic from '@tiptap/extension-italic'; // Explicitly import Italic
import Document from '@tiptap/extension-document'; // Explicitly import Document
import Text from '@tiptap/extension-text'; // Explicitly import Text
import History from '@tiptap/extension-history'; // Explicitly import History
import ListItem from '@tiptap/extension-list-item'; // Explicitly import ListItem

// Explicitly import extensions for headings, lists, and blockquote
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Blockquote from '@tiptap/extension-blockquote';


import "./editor.css";

type TiptapProps = {
  courseId: string;
  noteId?: string;
  initialContent: string;
  onContentChange: (content: string) => void;
};

const Tiptap = ({ courseId, noteId, initialContent, onContentChange }: TiptapProps) => {
  const editor = useEditor({
    immediatelyRender: false, // Add this line
    extensions: [
      Document, // Core extension
      Paragraph, // Core extension
      Text, // Core extension
      History, // Core extension
      Bold, // Core extension
      Italic, // Core extension
      Strike, // Core extension
      SlashCommand,
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
      Table,
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Superscript.configure(),
      Subscript.configure(),
      BubbleMenuExtension,
      // Explicitly add these extensions
      Heading.configure({ level: [1, 2, 3] }),
      ListItem, // Moved ListItem before BulletList and OrderedList
      BulletList,
      OrderedList,
      Blockquote,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap',
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
    if (editor) { // Add this block
      console.log("Editor initialized:", editor);
    }
  }, [editor, initialContent]);

  const saveNote = () => {
    if (editor) {
      onContentChange(editor.getHTML());
      console.log('Note content updated in parent state.');
    }
  };

  return (
    <div className="border border-gray-300 rounded-md flex flex-col h-full">
      <Toolbar editor={editor} onSave={saveNote} />
      <div className="flex-grow overflow-y-auto">
        <EditorContent editor={editor} className="prose max-w-none" />
      </div>
    </div>
  );
};

export default Tiptap;