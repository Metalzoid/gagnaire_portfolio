"use client";

import { useCallback } from "react";
import { adminApi } from "@/services/admin-api";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminIconCell } from "@/components/admin/AdminIconCell";
import { TechnologyForm } from "@/components/admin/TechnologyForm";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import type { Technology } from "shared";

type TechnologyWithId = Technology & { id: string };

export default function AdminTechnologiesPage() {
  const toast = useToast();
  const fetchItems = useCallback(
    () => adminApi.technologies.list() as Promise<TechnologyWithId[]>,
    [],
  );
  const deleteItem = useCallback(
    (id: string) => adminApi.technologies.delete(id),
    [],
  );
  const {
    items,
    loading,
    deleteTarget,
    setDeleteTarget,
    editingItem: editingTech,
    setEditingItem: setEditingTech,
    isCreating,
    setIsCreating,
    load,
    confirmDelete,
    closeForm,
  } = useAdminCrud<TechnologyWithId>({ fetchItems, deleteItem });

  const columns = [
    { key: "name", header: "Nom", render: (t: TechnologyWithId) => t.name },
    {
      key: "category",
      header: "Catégorie",
      render: (t: TechnologyWithId) => t.category ?? "—",
    },
    {
      key: "icon",
      header: "Icône",
      render: (t: TechnologyWithId) =>
        t.icon ? (
          <AdminIconCell icon={t.icon} name={t.name} size={20} />
        ) : (
          "—"
        ),
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <Button
          onClick={() => setIsCreating(true)}
          ariaLabel="Nouvelle technologie"
        >
          Nouvelle technologie
        </Button>
      </div>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <DataTable<TechnologyWithId>
          columns={columns}
          data={items}
          onEdit={(t) => setEditingTech(t)}
          onDelete={setDeleteTarget}
          emptyMessage="Aucune technologie"
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Supprimer la technologie"
        message={
          deleteTarget
            ? `Êtes-vous sûr de vouloir supprimer "${deleteTarget.name}" ? Elle sera retirée de tous les projets et expériences associés.`
            : ""
        }
        confirmLabel="Supprimer"
        onConfirm={async () => {
          await confirmDelete();
          toast.success("Technologie supprimée");
        }}
        onCancel={() => setDeleteTarget(null)}
      />
      <Modal
        isOpen={!!editingTech || isCreating}
        onClose={closeForm}
        title={editingTech ? "Modifier la technologie" : "Nouvelle technologie"}
        size="md"
      >
        {(editingTech || isCreating) && (
          <TechnologyForm
            defaultValues={
              editingTech
                ? {
                    name: editingTech.name,
                    icon: editingTech.icon ?? undefined,
                    category: editingTech.category ?? undefined,
                  }
                : undefined
            }
            onSubmit={async (data) => {
              if (editingTech) {
                await adminApi.technologies.update(editingTech.id, data);
                setEditingTech(null);
                toast.success("Technologie modifiée");
              } else {
                await adminApi.technologies.create(data);
                setIsCreating(false);
                toast.success("Technologie créée");
              }
              load();
            }}
            onCancel={closeForm}
            submitLabel={editingTech ? "Enregistrer" : "Créer"}
          />
        )}
      </Modal>
    </div>
  );
}
