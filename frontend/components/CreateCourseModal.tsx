'use client';

import { useState } from 'react';
import { createCourse, ApiError } from '@/lib/api';
import { X } from 'lucide-react';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated?: () => void;
}

export default function CreateCourseModal({ isOpen, onClose, onCourseCreated }: CreateCourseModalProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError('Course name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await createCourse(name);
      setName('');
      if (onCourseCreated) onCourseCreated();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-modal rounded-lg shadow-lg w-full max-w-md p-6 border border-border-light">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-primary">Create New Course</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="courseName" className="block text-sm font-medium text-text-secondary mb-1">
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border-light rounded-md px-3 py-2 bg-background-light text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue placeholder:text-text-secondary/50"
              placeholder="e.g. Distributed Systems"
              disabled={isLoading}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:bg-background-light rounded-md transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent-blue text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
