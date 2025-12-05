'use client';

import { useState, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface EditableTitleProps {
  initialTitle: string;
  onSave: (newTitle: string) => Promise<void>;
  className?: string;
  inputClassName?: string;
}

export default function EditableTitle({ initialTitle, onSave, className = '', inputClassName = '' }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [isLoading, setIsLoading] = useState(false);

  // Sync if initialTitle changes from parent
  useEffect(() => {
      setTitle(initialTitle);
  }, [initialTitle]);

  const handleSave = async () => {
    if (!title.trim() || title.trim() === initialTitle) {
      setIsEditing(false);
      setTitle(initialTitle);
      return;
    }
    
    setIsLoading(true);
    try {
      await onSave(title);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update title", error);
      // Optionally show error toast/alert
      alert("Failed to update title");
      setTitle(initialTitle); // Revert on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className={`border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName || className}`}
          disabled={isLoading}
          autoFocus
        />
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSave(); }} disabled={isLoading} className="p-1 text-green-600 hover:bg-green-50 rounded">
          <Check size={20} />
        </button>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCancel(); }} disabled={isLoading} className="p-1 text-red-600 hover:bg-red-50 rounded">
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2">
      <span className={`${className}`}>{title}</span>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsEditing(true);
        }} 
        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
        title="Edit Title"
      >
        <Pencil size={18} />
      </button>
    </div>
  );
}
