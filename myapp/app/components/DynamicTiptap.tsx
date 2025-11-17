"use client";

import { useState, useEffect } from "react";
import Tiptap from "./Editor"; // Import the component directly

type DynamicTiptapProps = {
  courseId: string;
  noteId?: string;
};

export default function DynamicTiptap({ courseId, noteId }: DynamicTiptapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsClient(true), 0);
  }, []);

  return (
    <>
      {isClient ? <Tiptap courseId={courseId} noteId={noteId} /> : <p>Loading editor...</p>}
    </>
  );
}
