import { useState } from "react";

export function useModal() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const openCreateModal = () => setShowCreate(true);
  const closeCreateModal = () => setShowCreate(false);

  const openEditModal = (id) => setShowEdit(id);
  const closeEditModal = () => setShowEdit(null);

  const openDeleteModal = (id) => setDeleteId(id);
  const closeDeleteModal = () => setDeleteId(null);

  return {
    showCreate,
    showEdit,
    deleteId,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal
  };
} 