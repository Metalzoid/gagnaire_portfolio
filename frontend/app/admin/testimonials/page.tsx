"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/services/admin-api";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import type { CreateTestimonialSchemaType, Testimonial } from "shared";

type TestimonialWithId = Testimonial & { id: string };

export default function AdminTestimonialsPage() {
  const toast = useToast();
  const [items, setItems] = useState<TestimonialWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<TestimonialWithId | null>(
    null,
  );
  const [editingItem, setEditingItem] = useState<TestimonialWithId | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.testimonials
      .list()
      .then((data) => setItems(data as TestimonialWithId[]))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleDelete = (item: TestimonialWithId) => setDeleteTarget(item);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.testimonials.delete(deleteTarget.id);
      setItems((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      toast.success("Témoignage supprimé");
    } finally {
      setDeleteTarget(null);
    }
  };

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
          onDelete={handleDelete}
          emptyMessage="Aucun témoignage"
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Supprimer le témoignage"
        message={deleteTarget ? `Supprimer "${deleteTarget.name}" ?` : ""}
        confirmLabel="Supprimer"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Modal
        isOpen={!!editingItem || isCreating}
        onClose={() => {
          setEditingItem(null);
          setIsCreating(false);
        }}
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
