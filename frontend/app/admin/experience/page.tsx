"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/services/admin-api";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AiEnhanceButton } from "@/components/admin/AiEnhanceButton";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import type { CreateExperienceSchemaType, Experience } from "shared";

type ExperienceWithId = Experience & { id: string };

export default function AdminExperiencePage() {
  const toast = useToast();
  const [items, setItems] = useState<ExperienceWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExperienceWithId | null>(
    null,
  );
  const [editingItem, setEditingItem] = useState<ExperienceWithId | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.experience
      .list()
      .then((data) =>
        setItems(
          (data as ExperienceWithId[]).sort((a, b) =>
            b.startDate.localeCompare(a.startDate),
          ),
        ),
      )
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    adminApi.ai.getStatus().then((s) => setAiEnabled(s.enabled)).catch(() => {});
  }, []);

  const handleDelete = (item: ExperienceWithId) => setDeleteTarget(item);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.experience.delete(deleteTarget.id);
      setItems((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      toast.success("Expérience supprimée");
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns = [
    { key: "title", header: "Titre", render: (e: ExperienceWithId) => e.title },
    {
      key: "company",
      header: "Entreprise",
      render: (e: ExperienceWithId) => e.company ?? "—",
    },
    {
      key: "type",
      header: "Type",
      render: (e: ExperienceWithId) => (
        <StatusBadge variant={e.type === "work" ? "work" : "education"}>
          {e.type}
        </StatusBadge>
      ),
    },
    {
      key: "dates",
      header: "Dates",
      render: (e: ExperienceWithId) =>
        `${e.startDate} — ${e.current ? "Aujourd'hui" : (e.endDate ?? "—")}`,
    },
    {
      key: "current",
      header: "Actuel",
      render: (e: ExperienceWithId) =>
        e.current ? <StatusBadge variant="current">Oui</StatusBadge> : "—",
    },
    ...(aiEnabled
      ? [
          {
            key: "ai",
            header: "IA",
            render: (e: ExperienceWithId) => (
              <AiEnhanceButton
                label="Améliorer"
                onEnhance={async () => {
                  try {
                    await adminApi.ai.enhanceExperience(e.id);
                    load();
                    toast.success("Expérience améliorée par l'IA");
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Erreur IA");
                  }
                }}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className="admin-page-header">
        <Button
          onClick={() => setIsCreating(true)}
          ariaLabel="Nouvelle expérience"
        >
          Nouvelle expérience
        </Button>
      </div>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <DataTable<ExperienceWithId>
          columns={columns}
          data={items}
          onEdit={(e) => setEditingItem(e)}
          onDelete={handleDelete}
          emptyMessage="Aucune expérience"
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Supprimer l'expérience"
        message={deleteTarget ? `Supprimer "${deleteTarget.title}" ?` : ""}
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
        title={editingItem ? "Modifier l'expérience" : "Nouvelle expérience"}
        size="lg"
      >
        {(editingItem || isCreating) && (
          <ExperienceForm
            defaultValues={
              editingItem
                ? {
                    type: editingItem.type as "work" | "education",
                    title: editingItem.title,
                    company: editingItem.company ?? undefined,
                    location: editingItem.location ?? undefined,
                    startDate: editingItem.startDate,
                    endDate: editingItem.endDate ?? undefined,
                    current: editingItem.current,
                    description: editingItem.description,
                    technologyIds:
                      editingItem.technologies?.map((t) => t.id) ?? [],
                  }
                : undefined
            }
            onSubmit={async (data: CreateExperienceSchemaType) => {
              if (editingItem) {
                await adminApi.experience.update(editingItem.id, data);
                setEditingItem(null);
                toast.success("Expérience modifiée");
              } else {
                await adminApi.experience.create(data);
                setIsCreating(false);
                toast.success("Expérience créée");
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
