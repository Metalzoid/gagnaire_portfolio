"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/services/admin-api";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AiEnhanceButton } from "@/components/admin/AiEnhanceButton";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import type { CreateExperienceSchemaType, Experience } from "shared";

type ExperienceWithId = Experience & { id: string };

export default function AdminExperiencePage() {
  const toast = useToast();
  const [aiEnabled, setAiEnabled] = useState(false);

  const fetchItems = useCallback(
    () => adminApi.experience.list() as Promise<ExperienceWithId[]>,
    [],
  );
  const deleteItem = useCallback(
    (id: string) => adminApi.experience.delete(id),
    [],
  );
  const transform = useCallback(
    (data: ExperienceWithId[]) =>
      [...data].sort((a, b) => b.startDate.localeCompare(a.startDate)),
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
  } = useAdminCrud<ExperienceWithId>({ fetchItems, deleteItem, transform });

  useEffect(() => {
    adminApi.ai.getStatus().then((s) => setAiEnabled(s.enabled)).catch(() => {});
  }, []);

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
      render: (e: ExperienceWithId) => {
        const label =
          e.type === "work"
            ? "Travail"
            : e.type === "alternance"
              ? "Formation en alternance"
              : "Formation";
        return (
          <StatusBadge variant={e.type === "work" ? "work" : e.type === "alternance" ? "alternance" : "education"}>
            {label}
          </StatusBadge>
        );
      },
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
          onDelete={setDeleteTarget}
          emptyMessage="Aucune expérience"
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Supprimer l'expérience"
        message={deleteTarget ? `Supprimer "${deleteTarget.title}" ?` : ""}
        confirmLabel="Supprimer"
        onConfirm={async () => {
          await confirmDelete();
          toast.success("Expérience supprimée");
        }}
        onCancel={() => setDeleteTarget(null)}
      />
      <Modal
        isOpen={!!editingItem || isCreating}
        onClose={closeForm}
        title={editingItem ? "Modifier l'expérience" : "Nouvelle expérience"}
        size="lg"
      >
        {(editingItem || isCreating) && (
          <ExperienceForm
            defaultValues={
              editingItem
                ? {
                    type: editingItem.type as "work" | "education" | "alternance",
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
