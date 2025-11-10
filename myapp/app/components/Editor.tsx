"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import { mergeAttributes } from '@tiptap/core';
import StarterKit from "@tiptap/starter-kit";
import Suggestion from '@tiptap/suggestion';
import commandSuggestion from './slash-command';
import QuestionBlock from './QuestionBlock';
import Cloze from './ClozeMark';
import AnswerBlock from './AnswerBlock';

// Import individual extensions
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';

// Extend TextStyle to add font size and font family commands
const CustomTextStyle = TextStyle.extend({
  addCommands() {
    return {
      ...this.parent?.(),
      setFontSize: (size) => ({ commands }) => {
        return commands.setStyle({ fontSize: size });
      },
      unsetFontSize: () => ({ commands }) => {
        return commands.unsetStyle({ fontSize: null });
      },
      setFontFamily: (family) => ({ commands }) => {
        return commands.setStyle({ fontFamily: family });
      },
      unsetFontFamily: () => ({ commands }) => {
        return commands.unsetStyle({ fontFamily: null });
      },
    };
  },
});

import "./editor.css";

// --- Correctly extend default nodes to be draggable ---

const DraggableParagraph = Paragraph.extend({
  draggable: true,
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'draggable-item' },
      ['div', { class: 'drag-handle', contentEditable: 'false', 'data-drag-handle': '' }, '⠿'],
      ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0],
    ]
  },
});

const DraggableHeading = Heading.extend({
  draggable: true,
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel ? node.attrs.level : this.options.levels[0];
    return [
      'div',
      { class: 'draggable-item' },
      ['div', { class: 'drag-handle', contentEditable: 'false', 'data-drag-handle': '' }, '⠿'],
      [`h${level}`, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0],
    ]
  },
});

const DraggableBlockquote = Blockquote.extend({
  draggable: true,
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'draggable-item' },
      ['div', { class: 'drag-handle', contentEditable: 'false', 'data-drag-handle': '' }, '⠿'],
      ['blockquote', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0],
    ]
  },
});

const DraggableBulletList = BulletList.extend({
  draggable: true,
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'draggable-item' },
      ['div', { class: 'drag-handle', contentEditable: 'false', 'data-drag-handle': '' }, '⠿'],
      ['ul', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0],
    ]
  },
});

const DraggableOrderedList = OrderedList.extend({
  draggable: true,
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'draggable-item' },
      ['div', { class: 'drag-handle', contentEditable: 'false', 'data-drag-handle': '' }, '⠿'],
      ['ol', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0],
    ]
  },
});

const DraggableTaskItem = TaskItem.extend({
  draggable: true,
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'draggable-item' },
      ['div', { class: 'drag-handle', contentEditable: 'false', 'data-drag-handle': '' }, '⠿'],
      ['li', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0],
    ]
  },
});

const DraggableTable = Table.extend({
  draggable: true,
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'draggable-item' },
      ['div', { class: 'drag-handle', contentEditable: 'false', 'data-drag-handle': '' }, '⠿'],
      ['table', mergeAttributes(HTMLAttributes), 0],
    ]
  },
});

const DraggableHorizontalRule = HorizontalRule.extend({
  draggable: true,
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'draggable-item' },
      ['div', { class: 'drag-handle', contentEditable: 'false', 'data-drag-handle': '' }, '⠿'],
      ['hr', mergeAttributes(HTMLAttributes)],
    ]
  },
});


const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: false,
        heading: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        table: false,
        horizontalRule: false,
        textStyle: false, // Disable default textStyle
        highlight: false, // Disable default highlight
      }),
      DraggableParagraph,
      DraggableHeading,
      DraggableBlockquote,
      DraggableBulletList,
      DraggableOrderedList,
      QuestionBlock,
      AnswerBlock,
      Cloze,
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose',
        },
        itemTypeName: 'taskItem',
      }),
      DraggableTaskItem,
      DraggableTable,
      TableRow,
      TableHeader,
      TableCell,
      DraggableHorizontalRule,
      CustomTextStyle,
      Color,
      Highlight.configure({ multicolor: true }), // Configure Highlight for multicolor
      Suggestion.configure({
        char: '/',
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
        ...commandSuggestion,
      })
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

  const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px'];
  const FONT_FAMILIES = ['Arial', 'Georgia', 'Times New Roman', 'Verdana'];
  const HIGHLIGHT_COLORS = ['yellow', '#ADFF2F', '#ADD8E6']; // Yellow, GreenYellow, LightBlue

  return (
    <>
      {editor && <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleMark('cloze').run()}
          className={editor.isActive('cloze') ? 'is-active' : ''}
        >
          Cloze
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          Ordered List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          Blockquote
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={editor.isActive('taskList') ? 'is-active' : ''}
        >
          Checklist
        </button>
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className={editor.isActive('table') ? 'is-active' : ''}
        >
          Table
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={editor.isActive('horizontalRule') ? 'is-active' : ''}
        >
          Divider
        </button>

        {/* Font Size Dropdown */}
        <select
          onChange={(e) => {
            if (e.target.value === '') {
              editor.chain().focus().unsetFontSize().run();
            } else {
              editor.chain().focus().setFontSize(e.target.value).run();
            }
          }}
          value={editor.getAttributes('textStyle').fontSize || ''}
        >
          <option value="">Size</option>
          {FONT_SIZES.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        {/* Font Family Dropdown */}
        <select
          onChange={(e) => {
            if (e.target.value === '') {
              editor.chain().focus().unsetFontFamily().run();
            } else {
              editor.chain().focus().setFontFamily(e.target.value).run();
            }
          }}
          value={editor.getAttributes('textStyle').fontFamily || ''}
        >
          <option value="">Font</option>
          {FONT_FAMILIES.map(family => (
            <option key={family} value={family}>{family}</option>
          ))}
        </select>

        {/* Color Input */}
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor(event.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
        />
        <button
          onClick={() => editor.chain().focus().unsetColor().run()}
          className={editor.isActive('textStyle', { color: editor.getAttributes('textStyle').color }) ? 'is-active' : ''}
        >
          Clear Color
        </button>

        {/* Highlight Buttons */}
        {HIGHLIGHT_COLORS.map(color => (
          <button
            key={color}
            onClick={() => editor.chain().focus().toggleHighlight({ color: color }).run()}
            className={editor.isActive('highlight', { color: color }) ? 'is-active' : ''}
            style={{ backgroundColor: color }}
          >
            Highlight
          </button>
        ))}
        <button
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          className={editor.isActive('highlight') ? 'is-active' : ''}
        >
          Clear Highlight
        </button>
      </BubbleMenu>}
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
"
