import { useState, useEffect } from "react";
import { apiKeysService } from "../../lib/database";
import { testSupabaseConnection, testTableExists } from "../../lib/test-connection";

function generateApiKey() {
  // Generate a realistic API key format
  return (
    "dandi-" + 
    Math.random().toString(36).substring(2, 8) + 
    Math.random().toString(36).substring(2, 8) + 
    Math.random().toString(36).substring(2, 8) + 
    Math.random().toString(36).substring(2, 8)
  );
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleKeys, setVisibleKeys] = useState(new Set());

  // Load API keys from Supabase
  useEffect(() => {
    testConnectionAndLoadData();
  }, []);

  const testConnectionAndLoadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Test connection first
      console.log("Testing Supabase connection...");
      const connectionTest = await testSupabaseConnection();
      if (!connectionTest.success) {
        throw new Error(`Connection failed: ${connectionTest.error}`);
      }

      // Test table exists
      const tableTest = await testTableExists();
      if (!tableTest.success) {
        throw new Error(`Table access failed: ${tableTest.error}`);
      }

      // If tests pass, load data
      await loadApiKeys();
    } catch (err) {
      const errorMessage = err.message || "Unknown error occurred";
      console.error("Setup failed:", err);
      setError("Setup failed: " + errorMessage);
      setLoading(false);
    }
  };

  const loadApiKeys = async () => {
    try {
      console.log("Attempting to load API keys from Supabase...");
      
      const keys = await apiKeysService.getAll();
      console.log("Loaded keys:", keys);
      setApiKeys(keys);
    } catch (err) {
      const errorMessage = err.message || "Unknown error occurred";
      console.error("Failed to load API keys:", err);
      setError("Failed to load API keys: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Toggle key visibility
  const toggleKeyVisibility = (keyId) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  // Create new API key
  const createApiKey = async (keyData) => {
    try {
      setError("");
      const newApiKey = {
        name: keyData.name,
        key: generateApiKey(),
        type: keyData.type,
        limit: parseInt(keyData.limit) || 1000
      };
      
      const createdKey = await apiKeysService.create(newApiKey);
      setApiKeys([createdKey, ...apiKeys]);
      return { success: true, key: createdKey };
    } catch (err) {
      const errorMessage = "Failed to create API key: " + err.message;
      setError(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    }
  };

  // Update API key
  const updateApiKey = async (id, updates) => {
    try {
      setError("");
      const updatedKey = await apiKeysService.update(id, updates);
      
      setApiKeys(apiKeys.map((k) =>
        k.id === id ? updatedKey : k
      ));
      return { success: true, key: updatedKey };
    } catch (err) {
      const errorMessage = "Failed to update API key: " + err.message;
      setError(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    }
  };

  // Delete API key
  const deleteApiKey = async (id) => {
    try {
      setError("");
      await apiKeysService.delete(id);
      setApiKeys(apiKeys.filter((k) => k.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = "Failed to delete API key: " + err.message;
      setError(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text, keyName) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log(`API key "${keyName}" copied to clipboard`);
      setError(""); // Clear any existing errors
      return { success: true };
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      const errorMessage = "Failed to copy to clipboard";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    apiKeys,
    loading,
    error,
    visibleKeys,
    toggleKeyVisibility,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    copyToClipboard,
    testConnectionAndLoadData,
    setError
  };
} 