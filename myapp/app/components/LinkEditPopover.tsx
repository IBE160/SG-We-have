"use client";

import React, { useState, useEffect } from 'react'; // Removed useRef
import { Editor } from '@tiptap/react';

interface LinkEditPopoverProps {
  editor: Editor;
  onClose: () => void;
}

export const LinkEditPopover: React.FC<LinkEditPopoverProps> = ({ editor, onClose }) => {
  const [url, setUrl] = useState('');
  // const popoverRef = useRef<HTMLDivElement>(null); // Removed popoverRef

  useEffect(() => {
    const previousUrl = editor.getAttributes('link').href;
    setUrl(previousUrl || '');

    // Removed handleClickOutside logic
    // const handleClickOutside = (event: MouseEvent) => {
    //   if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
    //     onClose();
    //   }
    // };

    // document.addEventListener('mousedown', handleClickOutside);
    // return () => {
    //   document.removeEventListener('mousedown', handleClickOutside);
    // };
  }, [editor, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      // Check if there's an active selection
      if (editor.state.selection.empty) {
        // If no text is selected, insert the URL as text and then apply the link
        editor.chain().focus().insertContent(url).setLink({ href: url }).run();
      } else {
        // If text is selected, apply the link to the selection
        editor.chain().focus().setLink({ href: url }).run();
      }
    } else {
      // If URL is empty, unset the link
      editor.chain().focus().unsetLink().run();
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="absolute z-10 mt-2 p-2 bg-white border border-gray-300 rounded-md shadow-lg flex flex-col gap-2">
      <input
        type="url"
        placeholder="Enter URL"
        className="p-2 border border-gray-300 rounded-md"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Apply
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </form>
  );
};