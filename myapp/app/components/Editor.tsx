"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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
      StarterKit.configure({
        strike: false,
        paragraph: false,
        link: false,
      }),
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
        openOnClick: false,
      }),
      Superscript.configure(),
      Subscript.configure(),
      Strike,
      BubbleMenuExtension,
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
  }, [editor, initialContent]);

  const saveNote = () => {
    if (editor) {
      onContentChange(editor.getHTML());
      console.log('Note content updated in parent state.');
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