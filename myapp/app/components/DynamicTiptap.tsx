"use client";

import { useState, useEffect } from "react";
import Tiptap from "./Editor"; // Import the component directly

type DynamicTiptapProps = {
  courseId: string;
  noteId?: string;
  initialContent: string;
  onContentChange: (content: string) => void;
};

export default function DynamicTiptap({ courseId, noteId, initialContent, onContentChange }: DynamicTiptapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsClient(true), 0);
  }, []);

  return (
    <>
      {isClient ? <Tiptap courseId={courseId} noteId={noteId} initialContent={initialContent} onContentChange={onContentChange} /> : <p>Loading editor...</p>}
    </>
  );
}
