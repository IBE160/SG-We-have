  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !lectureId) return;
      setIsLoading(true);
      setError(null);

      try {
        const coursesData = await getCourses();
        setCourses(coursesData);

        const allNotesData = await Promise.all(coursesData.map(c => getLectures(c.id)));
        const flattenedNotes = allNotesData.flat();
        setAllNotes(flattenedNotes);

        const foundLecture = flattenedNotes.find(l => l.id === lectureId);

        if (!foundLecture) {
          setError('Note not found or access denied.');
          return;
        }
        setLecture(foundLecture);

        const noteData = await getLectureNotes(lectureId);
        setNote(noteData);

      } catch (err) {
         if (err instanceof ApiError) {
            setError(err.message);
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Failed to load note details');
          }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId, lectureId]);

  const handleSave = async (content: string) => {
    if (!lectureId) return;
    try {
      const updatedNote = await updateLectureNotes(lectureId, content);
      setNote(updatedNote);
    } catch (err) {
      // Error handling is done in NoteEditor via promise rejection, 
      // but we can also log or show global error here if needed.
      console.error('Save failed in page:', err);
      throw err; // Re-throw so NoteEditor detects failure
    }
  };

  const handleGenerateQuiz = async (selectedLectureIds: string[], quizLength: number) => {
    try {
      const quiz = await generateQuiz(selectedLectureIds, quizLength);
      router.push(`/quiz/${quiz.id}`);
    } catch (err) {
      console.error('Failed to generate quiz:', err);
      alert('Failed to generate quiz. Please try again.');
    }
  };

  if (isLoading) {
      return <div className="p-10 text-center">Loading...</div>;
  }

  if (error) {
      return (
        <div className="p-10 text-center text-red-600">
            {error}
            <div className="mt-4">
                <Link href={`/dashboard/courses/${courseId}`} className="text-blue-600 underline">
                    Back to Course
                </Link>
            </div>
        </div>
      );
  }

  if (!lecture) {
      return <div className="p-10 text-center">Note not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
       <header className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
                <Link href={`/dashboard/courses/${courseId}`} className="text-blue-600 hover:text-blue-800 mr-4">
                    &larr; Back to Course
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                    {lecture.title}
                </h1>
            </div>
            <button
                onClick={() => setIsQuizModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
                Generate Quiz
            </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
            <NoteEditor 
                initialContent={note?.content || null} 
                onSave={handleSave} 
                lastSavedAt={note?.updated_at}
            />
        </div>
      </main>

      <QuizConfigModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        notes={allNotes}
        currentCourseId={courseId}

        onGenerate={handleGenerateQuiz}
      />
    </div>
  );
}
