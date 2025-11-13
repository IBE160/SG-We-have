"use client";

import { useState, useEffect } from "react";
import Tiptap from "./Editor"; // Import the component directly

export default function DynamicTiptap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ? <Tiptap /> : <p>Loading editor...</p>}
    </>
  );
}
