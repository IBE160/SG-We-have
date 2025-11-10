import { Mark, mergeAttributes } from '@tiptap/core';

export const Cloze = Mark.create({
  name: 'cloze',

  parseHTML() {
    return [
      {
        tag: 'span[data-type="cloze"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'cloze' }), 0];
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-c': () => this.editor.commands.toggleMark(this.name),
    };
  },
});

export default Cloze;
