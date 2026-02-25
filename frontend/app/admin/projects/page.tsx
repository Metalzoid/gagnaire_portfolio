"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/services/admin-api";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AiEnhanceButton } from "@/components/admin/AiEnhanceButton";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import { useAdminCrud } from "@/hooks/useAdminCrud";
import type { CreateProjectSchemaType, Project } from "shared";

type ProjectWithId = Project & { id: string };

export default function AdminProjectsPage() {
  const toast = useToast();
  const [aiEnabled, setAiEnabled] = useState(false);

  const fetchItems = useCallback(
    () => adminApi.projects.list() as Promise<ProjectWithId[]>,
    [],
  );
  const deleteItem = useCallback(
    (id: string) => adminApi.projects.delete(id),
    [],
  );
  const {
    items,
    loading,
    deleteTarget,
    setDeleteTarget,
    editingItem: editingProject,
    setEditingItem: setEditingProject,
    isCreating,
    setIsCreating,
    load,
    confirmDelete,
    closeForm,
  } = useAdminCrud<ProjectWithId>({ fetchItems, deleteItem });

  useEffect(() => {
    adminApi.ai.getStatus().then((s) => setAiEnabled(s.enabled)).catch(() => {});
  }, []);

  const columns = [
    { key: "title", header: "Titre", render: (p: ProjectWithId) => p.title },
    {
      key: "category",
      header: "Catégorie",
      render: (p: ProjectWithId) => p.category,
    },
    {
      key: "featured",
      header: "Featured",
      render: (p: ProjectWithId) =>
        p.featured ? <StatusBadge variant="featured">Oui</StatusBadge> : <StatusBadge variant="no">Non</StatusBadge>,
    },
    { key: "date", header: "Date", render: (p: ProjectWithId) => p.date },
    ...(aiEnabled
      ? [
          {
            key: "ai",
            header: "IA",
            render: (p: ProjectWithId) => (
              <AiEnhanceButton
                label="Améliorer"
                onEnhance={async () => {
                  try {
                    await adminApi.ai.enhanceProject(p.id);
                    load();
                    toast.success("Projet amélioré par l'IA");
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
        <Button onClick={() => setIsCreating(true)} ariaLabel="Nouveau projet">
          Nouveau projet
        </Button>
      </div>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <DataTable<ProjectWithId>
          columns={columns}
          data={items}
          onEdit={(p) => setEditingProject(p)}
          onDelete={setDeleteTarget}
          emptyMessage="Aucun projet"
        />
      )}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Supprimer le projet"
        message={
          deleteTarget
            ? `Êtes-vous sûr de vouloir supprimer "${deleteTarget.title}" ?`
            : ""
        }
        confirmLabel="Supprimer"
        onConfirm={async () => {
          await confirmDelete();
          toast.success("Projet supprimé");
        }}
        onCancel={() => setDeleteTarget(null)}
      />
      <Modal
        isOpen={!!editingProject || isCreating}
        onClose={closeForm}
        title={editingProject ? "Modifier le projet" : "Nouveau projet"}
        size="lg"
      >
        {(editingProject || isCreating) && (
          <ProjectForm
            defaultValues={
              editingProject
                ? {
                    id: editingProject.id,
                    slug: editingProject.slug,
                    title: editingProject.title,
                    description: editingProject.description,
                    longDescription: editingProject.longDescription,
                    technologyIds:
                      editingProject.technologies?.map((t) => t.id) ?? [],
                    category: editingProject.category,
                    images: editingProject.images ?? [],
                    github: editingProject.github ?? undefined,
                    demo: editingProject.demo ?? undefined,
                    featured: editingProject.featured,
                    date: editingProject.date,
                  }
                : undefined
            }
            onImagesChange={(images) =>
              setEditingProject((prev) => (prev ? { ...prev, images } : null))
            }
            onSubmit={async (data: CreateProjectSchemaType) => {
              if (editingProject) {
                await adminApi.projects.update(editingProject.id, data);
                setEditingProject(null);
                toast.success("Projet modifié");
              } else {
                const created = await adminApi.projects.create(data);
                setIsCreating(false);
                setEditingProject(created as ProjectWithId);
                toast.success("Projet créé. Vous pouvez ajouter des images.");
              }
              load();
            }}
            submitLabel={editingProject ? "Enregistrer" : "Créer"}
          />
        )}
      </Modal>
    </div>
  );
}
