'use client';

import { FormEvent, useState, useEffect } from 'react';
import { Note } from '@/lib/api';
import CustomSelect from '@/components/CustomSelect';

interface QuizConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  currentCourseId: string;
  onGenerate: (selectedNoteIds: string[], quizLength: number) => Promise<void> | void;
}

export default function QuizConfigModal({ isOpen, onClose, notes, currentCourseId, onGenerate }: QuizConfigModalProps) {
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [quizLength, setQuizLength] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredNotes = notes.filter(note => note.course_id === currentCourseId);

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
    if (selectedNoteIds.length === filteredNotes.length) {
      setSelectedNoteIds([]);
    } else {
      setSelectedNoteIds(filteredNotes.map(n => n.id));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedNoteIds.length === 0) return;
    
    setIsGenerating(true);
    try {
        console.log("Quiz generation initiated with notes:", selectedNoteIds, "Length:", quizLength);
        await onGenerate(selectedNoteIds, quizLength);
        onClose();
    } catch (error) {
        console.error("Quiz generation failed:", error);
        // Optionally handle error display here
    } finally {
        setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const quizLengthOptions = [5, 10, 15, 20, 25, 30].map((length) => ({
    id: String(length),
    name: `${length} Questions`
  }));

  const selectedQuizLengthOption = quizLengthOptions.find(opt => Number(opt.id) === quizLength) || null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-modal rounded-xl p-6 w-full max-w-2xl mx-auto flex flex-col max-h-[90vh] shadow-soft border border-border-light">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Configure Quiz</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary" disabled={isGenerating}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
           <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-text-secondary">Select Notes</label>
              <button 
                type="button" 
                onClick={handleSelectAll}
                className="text-sm text-accent-blue hover:text-accent-blue/80 font-medium"
                disabled={filteredNotes.length === 0 || isGenerating}
              >
                {selectedNoteIds.length === filteredNotes.length && filteredNotes.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
           </div>

           <div className="flex-1 overflow-y-auto border border-border-light rounded-md mb-4 p-2 bg-card">
             {filteredNotes.length === 0 ? (
                <p className="text-center text-text-secondary py-4">No notes available for this course.</p>
             ) : (
               <div className="space-y-2">
                 {filteredNotes.map(note => (
                   <div key={note.id} className="flex items-start p-2 rounded hover:bg-sidebar-hover transition-colors">
                     <div className="flex items-center h-5">
                       <input
                         id={`note-${note.id}`}
                         name={`note-${note.id}`}
                         type="checkbox"
                         className="focus:ring-accent-blue h-4 w-4 text-accent-blue border-border-light rounded bg-card"
                         checked={selectedNoteIds.includes(note.id)}
                         onChange={() => handleCheckboxChange(note.id)}
                         disabled={isGenerating}
                       />
                     </div>
                     <div className="ml-3 text-sm">
                       <label htmlFor={`note-${note.id}`} className="font-medium text-text-primary cursor-pointer select-none">
                         {note.title}
                       </label>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>

           <div className="mb-4">
             <CustomSelect
                label="Number of Questions"
                options={quizLengthOptions}
                value={selectedQuizLengthOption}
                onChange={(option) => setQuizLength(Number(option.id))}
                placeholder="Select number of questions"
                disabled={isGenerating}
             />
           </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-border-light mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:bg-sidebar-hover hover:text-text-primary rounded-md transition-colors"
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedNoteIds.length === 0 || isGenerating}
              className={`px-4 py-2 text-white rounded-md shadow-md transition-colors font-medium ${selectedNoteIds.length === 0 || isGenerating ? 'bg-accent-blue/50 cursor-not-allowed' : 'bg-accent-blue hover:bg-accent-blue/90'}`}
            >
              {isGenerating ? 'Generating...' : 'Generate Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}