import { useCallback, useEffect, useState } from "react";

interface UseAdminCrudOptions<T> {
  fetchItems: () => Promise<T[]>;
  deleteItem: (id: string) => Promise<void>;
  /** Transform items after fetch (e.g. sort) */
  transform?: (items: T[]) => T[];
}

export function useAdminCrud<T extends { id: string }>({
  fetchItems,
  deleteItem,
  transform,
}: UseAdminCrudOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetchItems()
      .then((data) => setItems(transform ? transform(data) : data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [fetchItems, transform]);

  useEffect(() => load(), [load]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem(deleteTarget.id);
      setItems((prev) => prev.filter((x) => x.id !== deleteTarget.id));
    } finally {
      setDeleteTarget(null);
    }
  };

  const closeForm = () => {
    setEditingItem(null);
    setIsCreating(false);
  };

  return {
    items,
    setItems,
    loading,
    deleteTarget,
    setDeleteTarget,
    editingItem,
    setEditingItem,
    isCreating,
    setIsCreating,
    load,
    confirmDelete,
    closeForm,
  };
}
