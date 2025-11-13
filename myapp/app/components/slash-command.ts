import { ReactRenderer, Editor } from '@tiptap/react';
import tippy, { Instance } from 'tippy.js';
import CommandList, { CommandListRef } from './CommandList';

interface CommandFunction {
  (props: { editor: Editor; range: { from: number; to: number } }): void;
}

const commandSuggestion = {
  items: ({ query }: { query: string }) => {
    return [
      {
        title: 'Heading 1',
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
        },
      },
      {
        title: 'Bullet List',
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: 'Ordered List',
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: 'Blockquote',
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
          editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        },
      },
      {
        title: 'Code Block',
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
          editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
        },
      },
      {
        title: 'Callout',
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
          editor.chain().focus().deleteRange(range).setNode('calloutBlock').run();
        },
      },
      {
        title: 'Checklist',
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
          editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
      },
      {
        title: 'Table',
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
          editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        },
      },
      {
        title: 'Divider',
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
          editor.chain().focus().deleteRange(range).setHorizontalRule().run();
        },
      },
      {
        title: 'Question',
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
          editor.chain().focus().deleteRange(range).setNode('questionBlock').run();
        },
      },
      {
        title: 'Answer',
        command: ({ editor, range }: { editor: Editor; range: { from: number; to: number } }) => {
          editor.chain().focus().deleteRange(range).setNode('answerBlock').run();
        },
      },
    ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10);
  },

  render: () => {
    let component: ReactRenderer<CommandListRef>;
    let popup: Instance[];

    return {
      onStart: (props: { editor: Editor; clientRect: () => ClientRect | DOMRect; command: CommandFunction }) => {
        component = new ReactRenderer(CommandList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props: { editor: Editor; clientRect: () => ClientRect | DOMRect; command: CommandFunction }) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};

export default commandSuggestion;