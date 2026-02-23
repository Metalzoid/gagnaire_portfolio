"use client";

import { useCallback } from "react";
import { adminApi } from "@/services/admin-api";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import type { CreateTestimonialSchemaType, Testimonial } from "shared";

type TestimonialWithId = Testimonial & { id: string };

export default function AdminTestimonialsPage() {
  const toast = useToast();
  const fetchItems = useCallback(
    () => adminApi.testimonials.list() as Promise<TestimonialWithId[]>,
    [],
  );
  const deleteItem = useCallback(
    (id: string) => adminApi.testimonials.delete(id),
    [],
  );
  const {
    items,
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
  } = useAdminCrud<TestimonialWithId>({ fetchItems, deleteItem });

  const columns = [
    { key: "name", header: "Nom", render: (t: TestimonialWithId) => t.name },
    {
      key: "company",
      header: "Entreprise",
      render: (t: TestimonialWithId) => t.company,
    },
    {
      key: "quote",
      header: "Extrait",
      render: (t: TestimonialWithId) =>
        t.quote.length > 60 ? `${t.quote.slice(0, 60)}…` : t.quote,
    },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <Button
          onClick={() => setIsCreating(true)}
          ariaLabel="Nouveau témoignage"
        >
          Nouveau témoignage
        </Button>
      </div>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <DataTable<TestimonialWithId>
          columns={columns}
          data={items}
          onEdit={(t) => setEditingItem(t)}
          onDelete={setDeleteTarget}
          emptyMessage="Aucun témoignage"
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Supprimer le témoignage"
        message={deleteTarget ? `Supprimer "${deleteTarget.name}" ?` : ""}
        confirmLabel="Supprimer"
        onConfirm={async () => {
          await confirmDelete();
          toast.success("Témoignage supprimé");
        }}
        onCancel={() => setDeleteTarget(null)}
      />
      <Modal
        isOpen={!!editingItem || isCreating}
        onClose={closeForm}
        title={editingItem ? "Modifier le témoignage" : "Nouveau témoignage"}
        size="md"
      >
        {(editingItem || isCreating) && (
          <TestimonialForm
            defaultValues={
              editingItem
                ? {
                    name: editingItem.name,
                    role: editingItem.role,
                    company: editingItem.company,
                    quote: editingItem.quote,
                    photo: editingItem.photo,
                  }
                : undefined
            }
            onSubmit={async (data: CreateTestimonialSchemaType) => {
              if (editingItem) {
                await adminApi.testimonials.update(editingItem.id, data);
                setEditingItem(null);
                toast.success("Témoignage modifié");
              } else {
                await adminApi.testimonials.create(data);
                setIsCreating(false);
                toast.success("Témoignage créé");
              }
              load();
            }}
            submitLabel={editingItem ? "Enregistrer" : "Créer"}
          />
        )}
      </Modal>
    </div>
  );
}
