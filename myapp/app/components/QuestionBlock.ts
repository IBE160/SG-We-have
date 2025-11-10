import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import QuestionBlockComponent from './QuestionBlockComponent';

export const QuestionBlock = Node.create({
  name: 'questionBlock',

  group: 'block',

  content: 'inline*',

  draggable: true, // Make the node draggable

  parseHTML() {
    return [
      {
        tag: 'div[data-type="question-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'question-block' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(QuestionBlockComponent);
  },
});

export default QuestionBlock;
