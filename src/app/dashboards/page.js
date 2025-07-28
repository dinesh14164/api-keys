"use client";
import React, { useState } from "react";
import { useApiKeys } from "../../hooks/useApiKeys";
import { useToast } from "../../hooks/useToast";
import { useModal } from "../../hooks/useModal";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import CurrentPlanCard from "../../components/dashboard/CurrentPlanCard";
import ApiKeysTable from "../../components/dashboard/ApiKeysTable";
import CreateApiKeyModal from "../../components/dashboard/modals/CreateApiKeyModal";
import EditApiKeyModal from "../../components/dashboard/modals/EditApiKeyModal";
import DeleteConfirmationModal from "../../components/dashboard/modals/DeleteConfirmationModal";
import ToastNotification from "../../components/dashboard/ToastNotification";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editKeyName, setEditKeyName] = useState("");

  // Custom hooks
  const {
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
  } = useApiKeys();

  const {
    showToast,
    toastMessage,
    toastType,
    showToastNotification,
    hideToast
  } = useToast();

  const {
    showCreate,
    showEdit,
    deleteId,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal
  } = useModal();

  // Handle create API key
  const handleCreate = async (keyData) => {
    const result = await createApiKey(keyData);
    if (result.success) {
      showToastNotification("API Key created successfully!", "success");
    } else {
      showToastNotification("Failed to create API key.", "error");
    }
    return result;
  };

  // Handle edit API key
  const handleEdit = async (id, updates) => {
    const result = await updateApiKey(id, updates);
    if (result.success) {
      showToastNotification("API Key updated successfully!", "success");
    } else {
      showToastNotification("Failed to update API key.", "error");
    }
    return result;
  };

  // Handle delete API key
  const handleDelete = async (id) => {
    const result = await deleteApiKey(id);
    if (result.success) {
      showToastNotification("API Key deleted successfully!", "delete");
    } else {
      showToastNotification("Failed to delete API key.", "error");
    }
    return result;
  };

  // Handle copy to clipboard
  const handleCopy = async (text, keyName) => {
    const result = await copyToClipboard(text, keyName);
    if (result.success) {
      showToastNotification(`API Key "${keyName}" copied to clipboard!`, "success");
    } else {
      showToastNotification("Failed to copy API key to clipboard.", "error");
    }
  };

  // Handle edit modal
  const handleEditClick = (id, currentName) => {
    setEditKeyName(currentName);
    openEditModal(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {/* Current Plan Card */}
          <CurrentPlanCard />

          {/* API Keys Section */}
          <ApiKeysTable
            apiKeys={apiKeys}
            loading={loading}
            error={error}
            visibleKeys={visibleKeys}
            onToggleVisibility={toggleKeyVisibility}
            onCopy={handleCopy}
            onEdit={handleEditClick}
            onDelete={openDeleteModal}
            onCreateNew={openCreateModal}
            onRetry={testConnectionAndLoadData}
          />
        </div>

        {/* Modals */}
        <CreateApiKeyModal
          isOpen={showCreate}
          onClose={closeCreateModal}
          onCreate={handleCreate}
        />

        <EditApiKeyModal
          isOpen={!!showEdit}
          keyId={showEdit}
          currentName={editKeyName}
          onClose={closeEditModal}
          onUpdate={handleEdit}
        />

        <DeleteConfirmationModal
          isOpen={!!deleteId}
          keyId={deleteId}
          onClose={closeDeleteModal}
          onDelete={handleDelete}
        />

        {/* Toast Notification */}
        <ToastNotification
          show={showToast}
          message={toastMessage}
          type={toastType}
          onClose={hideToast}
        />
      </div>
    </div>
  );
} 