"use client";

import DynamicTiptap from "@/app/components/DynamicTiptap";
import { useParams, useSearchParams } from 'next/navigation';

export default function CourseEditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;
  const noteId = searchParams.get('noteId');

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Tiptap Editor for {courseId}</h1>
        <DynamicTiptap courseId={courseId} noteId={noteId || undefined} />
      </div>
    </main>
  );
}
