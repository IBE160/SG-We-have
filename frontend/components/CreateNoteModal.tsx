'use client';

import { useState } from 'react';
import { createNote } from '@/lib/api';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onNoteCreated: () => void;
}

export default function CreateNoteModal({ isOpen, onClose, courseId, onNoteCreated }: CreateNoteModalProps) {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createNote(courseId, title);
      setTitle('');
      onNoteCreated();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create note');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-modal rounded-xl p-6 w-full max-w-md shadow-soft border border-border-light">
        <h2 className="text-xl font-bold mb-4 text-text-primary">Add New Note</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">
              Note Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-accent-blue bg-card text-text-primary"
              placeholder="e.g., Introduction to Neural Networks"
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:bg-sidebar-hover hover:text-text-primary rounded-md transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent-blue text-white rounded-md hover:bg-accent-blue/90 disabled:opacity-50 transition-colors font-semibold shadow-md"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
