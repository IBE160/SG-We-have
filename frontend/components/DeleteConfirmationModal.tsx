'use client';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-modal rounded-xl p-6 w-full max-w-md shadow-soft border border-border-light">
        <div className="flex items-center gap-3 mb-4 text-red-500">
          <span className="material-symbols-outlined text-2xl">warning</span>
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        </div>
        
        <p className="text-text-secondary mb-6">{message}</p>

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
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium shadow-md"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
