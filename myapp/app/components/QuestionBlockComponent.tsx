import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import './editor.css';

const QuestionBlockComponent = () => {
  return (
    <NodeViewWrapper className="question-block draggable-item">
      <div className="drag-handle" contentEditable={false} data-drag-handle>
        ⠿
      </div>
      <span className="icon" contentEditable={false}>
        ❓
      </span>
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default QuestionBlockComponent;
