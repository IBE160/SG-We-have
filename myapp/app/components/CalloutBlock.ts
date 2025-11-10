import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CalloutBlockComponent from './CalloutBlockComponent';

export const CalloutBlock = Node.create({
  name: 'calloutBlock',

  group: 'block',

  content: 'inline*',

  draggable: true, // Make it draggable

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'callout-block' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutBlockComponent);
  },
});

export default CalloutBlock;
