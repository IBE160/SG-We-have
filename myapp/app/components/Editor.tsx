"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { mergeAttributes } from '@tiptap/core';
import StarterKit from "@tiptap/starter-kit";
import QuestionBlock from './QuestionBlock';
import Cloze from './ClozeMark';
import AnswerBlock from './AnswerBlock';
import { Toolbar } from "./Toolbar";
import { SlashCommand } from "./slash-command-extension";

// Import individual extensions
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Strike from '@tiptap/extension-strike';



import "./editor.css";

const Tiptap = () => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        strike: false, // Keep this false as Strike is added separately
        paragraph: false, // Disable default paragraph to use custom one
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

  return (
    <div className="border border-gray-300 rounded-md">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;