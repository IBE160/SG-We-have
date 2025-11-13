"use client";

import { useState, useEffect } from "react";
import Tiptap from "./Editor"; // Import the component directly

export default function DynamicTiptap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsClient(true), 0);
  }, []);

  return (
    <>
      {isClient ? <Tiptap /> : <p>Loading editor...</p>}
    </>
  );
}
