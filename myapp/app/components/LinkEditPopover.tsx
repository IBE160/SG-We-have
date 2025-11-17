"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';

interface LinkEditPopoverProps {
  editor: Editor;
  onClose: () => void;
}

export const LinkEditPopover: React.FC<LinkEditPopoverProps> = ({ editor, onClose }) => {
  const [url, setUrl] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousUrl = editor.getAttributes('link').href;
    setUrl(previousUrl || '');

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editor, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    onClose();
  };

  return (
    <div ref={popoverRef} className="absolute z-10 mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-lg">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          placeholder="Enter URL"
          className="mockup-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" className="mockup-button mockup-button-primary">
          Apply
        </button>
        <button type="button" onClick={onClose} className="mockup-button mockup-button-outline">
          Cancel
        </button>
      </form>
    </div>
  );
};
