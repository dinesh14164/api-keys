import React, { useState } from "react";

export default function CreateApiKeyModal({ isOpen, onClose, onCreate }) {
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyType, setNewKeyType] = useState("dev");
  const [newKeyLimit, setNewKeyLimit] = useState("1000");

  const handleClose = () => {
    setNewKeyName("");
    setNewKeyType("dev");
    setNewKeyLimit("1000");
    onClose();
  };

  const handleCreate = async () => {
    if (!newKeyName.trim()) return;
    
    const result = await onCreate({
      name: newKeyName,
      type: newKeyType,
      limit: newKeyLimit
    });

    if (result?.success) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg mx-auto max-h-screen overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Create a new API Key</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Enter a name and limit for the new API key.</p>
          
          {/* Key Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Key Name <span className="text-gray-500">— A unique name to identify this key</span>
            </label>
            <input
              className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Key Name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Key Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Key Type <span className="text-gray-500">— Choose the environment for this key</span>
            </label>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="keyType"
                  value="dev"
                  checked={newKeyType === "dev"}
                  onChange={(e) => setNewKeyType(e.target.value)}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">&lt;/&gt;</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Development</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Rate limited to 100 requests/minute</div>
                  </div>
                </div>
              </label>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="keyType"
                  value="prod"
                  checked={newKeyType === "prod"}
                  onChange={(e) => setNewKeyType(e.target.value)}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">🚀</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Production</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Fast rate limit, 600 req/minute</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Usage Limit */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Limit monthly usage*
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={newKeyLimit}
              onChange={(e) => setNewKeyLimit(e.target.value)}
              min="1"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              className="px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCreate}
              disabled={!newKeyName.trim()}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 