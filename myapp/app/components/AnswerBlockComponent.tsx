import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Node } from '@tiptap/pm/model';
import './editor.css';

interface AnswerBlockComponentProps {
  node: Node;
  updateAttributes: (attrs: Record<string, any>) => void;
}

const AnswerBlockComponent: React.FC<AnswerBlockComponentProps> = ({ node, updateAttributes }) => {
  const isVisible = node.attrs.visible;

  const toggleVisibility = () => {
    updateAttributes({
      visible: !isVisible,
    });
  };

  return (
    <NodeViewWrapper className={`answer-block ${isVisible ? 'is-visible' : ''}`}>
      <div className="answer-header" contentEditable={false}>
        <strong>Answer</strong>
        <button onClick={toggleVisibility}>
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>
      {isVisible && (
        <NodeViewContent className="content" />
      )}
    </NodeViewWrapper>
  );
};

export default AnswerBlockComponent;
