"use client";

import { useState, useEffect } from "react";
import Tiptap from "./Editor"; // Import the component directly

export default function DynamicTiptap({ courseId }: { courseId: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsClient(true), 0);
  }, []);

  return (
    <>
      {isClient ? <Tiptap courseId={courseId} /> : <p>Loading editor...</p>}
    </>
  );
}
