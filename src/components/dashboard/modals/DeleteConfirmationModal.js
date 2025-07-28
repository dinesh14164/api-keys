import React from "react";

export default function DeleteConfirmationModal({ isOpen, keyId, onClose, onDelete }) {
  const handleDelete = async () => {
    const result = await onDelete(keyId);
    
    if (result?.success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Delete API Key?</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">Are you sure you want to delete this API key? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 