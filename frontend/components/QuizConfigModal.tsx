'use client';

import { FormEvent, useState } from 'react';
import { Note } from '@/lib/api';

interface QuizConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onGenerate: (selectedNoteIds: string[], quizLength: number) => void;
}

export default function QuizConfigModal({ isOpen, onClose, notes, onGenerate }: QuizConfigModalProps) {
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [quizLength, setQuizLength] = useState<number>(10);

  // In the new model, a Note always "has content" potentially, but we can check length
  // Or just allow selecting any note. For now, allow all notes.
  const availableNotes = notes.filter(n => n.content && n.content.trim().length > 0); 
  // Actually in `getNotes`, we get the list. But `content` is in the Note object now. 
  // Wait, `getNotes` returns `Note[]` which has `content`.
  // So we can filter by content existence.

  const handleCheckboxChange = (noteId: string) => {
    setSelectedNoteIds(prev => {
      if (prev.includes(noteId)) {
        return prev.filter(id => id !== noteId);
      } else {
        return [...prev, noteId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedNoteIds.length === availableNotes.length) {
      // Deselect all
      setSelectedNoteIds([]);
    } else {
      // Select all available
      setSelectedNoteIds(availableNotes.map(n => n.id));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedNoteIds.length === 0) return;
    
    console.log("Quiz generation initiated with notes:", selectedNoteIds, "Length:", quizLength);
    onGenerate(selectedNoteIds, quizLength);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Configure Quiz</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
           <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Select Notes</label>
              <button 
                type="button" 
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
                disabled={availableNotes.length === 0}
              >
                {selectedNoteIds.length === availableNotes.length && availableNotes.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
           </div>

           <div className="flex-1 overflow-y-auto border border-gray-200 rounded-md mb-4 p-2">
             {notes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No notes available.</p>
             ) : (
               <div className="space-y-2">
                 {notes.map(note => {
                   const hasContent = note.content && note.content.trim().length > 0;
                   return (
                   <div key={note.id} className={`flex items-start p-2 rounded hover:bg-gray-50 ${!hasContent ? 'opacity-50 bg-gray-100' : ''}`}>
                     <div className="flex items-center h-5">
                       <input
                         id={`note-${note.id}`}
                         name={`note-${note.id}`}
                         type="checkbox"
                         className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                         checked={selectedNoteIds.includes(note.id)}
                         onChange={() => handleCheckboxChange(note.id)}
                         disabled={!hasContent}
                       />
                     </div>
                     <div className="ml-3 text-sm">
                       <label htmlFor={`note-${note.id}`} className={`font-medium text-gray-700 ${!hasContent ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                         {note.title}
                       </label>
                       {!hasContent && (
                         <p className="text-gray-500 text-xs">Empty note. Add content to include in quiz.</p>
                       )}
                     </div>
                   </div>
                   );
                 })}
               </div>
             )}
           </div>

           <div className="mb-4">
             <label htmlFor="quiz-length" className="block text-sm font-medium text-gray-700 mb-1">
               Number of Questions
             </label>
             <select
               id="quiz-length"
               value={quizLength}
               onChange={(e) => setQuizLength(Number(e.target.value))}
               className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
             >
               {[5, 10, 15, 20, 25, 30].map((length) => (
                 <option key={length} value={length}>
                   {length} Questions
                 </option>
               ))}
             </select>
           </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedNoteIds.length === 0}
              className={`px-4 py-2 text-white rounded-md ${selectedNoteIds.length === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Generate Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
