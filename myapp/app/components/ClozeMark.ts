import { Mark, mergeAttributes } from '@tiptap/core';

export interface ClozeOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    cloze: {
      /**
       * Set a cloze
       */
      setCloze: () => ReturnType;
      /**
       * Toggle a cloze
       */
      toggleCloze: () => ReturnType;
      /**
       * Unset a cloze
       */
      unsetCloze: () => ReturnType;
    };
  }
}

export const Cloze = Mark.create<ClozeOptions>({
  name: 'cloze',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="cloze"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'cloze' }), 0];
  },

  addCommands() {
    return {
      setCloze: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleCloze: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetCloze: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-c': () => this.editor.commands.toggleCloze(),
    };
  },
});

export default Cloze;
