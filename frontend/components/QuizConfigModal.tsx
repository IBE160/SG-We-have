'use client';

import { FormEvent } from 'react';

interface QuizConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuizConfigModal({ isOpen, onClose }: QuizConfigModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Future: Handle quiz configuration submission
    console.log("Quiz generation initiated");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Configure Quiz</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          {/* Future: Quiz configuration options go here */}
          <div className="mb-4">
            <label htmlFor="quizLength" className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Length (Future)
            </label>
            <input
              type="number"
              id="quizLength"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., 10"
              disabled
            />
          </div>

           <div className="p-4 text-gray-500 text-sm text-center bg-gray-50 rounded mb-4">
             Lecture selection coming soon.
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Generate Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
