import DynamicTiptap from "@/app/components/DynamicTiptap";

export default async function CourseEditorPage({ params }: { params: { courseId: string } }) {
  const resolvedParams = await params;
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Tiptap Editor for {resolvedParams.courseId}</h1>
        <DynamicTiptap courseId={resolvedParams.courseId} />
      </div>
    </main>
  );
}
