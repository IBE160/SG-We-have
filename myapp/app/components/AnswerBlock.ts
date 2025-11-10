import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import AnswerBlockComponent from './AnswerBlockComponent';

export const AnswerBlock = Node.create({
  name: 'answerBlock',

  group: 'block',

  content: 'inline*',

  addAttributes() {
    return {
      visible: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="answer-block"]',
        getAttrs: dom => ({
          visible: dom.getAttribute('data-visible') === 'true',
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 
        'data-type': 'answer-block',
        'data-visible': HTMLAttributes.visible,
      }),
      0
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AnswerBlockComponent);
  },
});

export default AnswerBlock;
