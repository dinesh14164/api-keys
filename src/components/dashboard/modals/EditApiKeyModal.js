import React, { useState, useEffect } from "react";

export default function EditApiKeyModal({ isOpen, keyId, currentName, onClose, onUpdate }) {
  const [editKeyName, setEditKeyName] = useState("");

  useEffect(() => {
    if (isOpen && currentName) {
      setEditKeyName(currentName);
    }
  }, [isOpen, currentName]);

  const handleClose = () => {
    setEditKeyName("");
    onClose();
  };

  const handleUpdate = async () => {
    if (!editKeyName.trim()) return;
    
    const result = await onUpdate(keyId, { name: editKeyName });
    
    if (result?.success) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Edit API Key Name</h2>
        <input
          className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Key name"
          value={editKeyName}
          onChange={(e) => setEditKeyName(e.target.value)}
          autoFocus
        />
        <div className="flex gap-3 justify-end">
          <button
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleUpdate}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 