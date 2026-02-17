"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/services/admin-api";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import type { CreateProjectSchemaType, Project } from "shared";

type ProjectWithId = Project & { id: string };

export default function AdminProjectsPage() {
  const toast = useToast();
  const [projects, setProjects] = useState<ProjectWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ProjectWithId | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectWithId | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.projects
      .list()
      .then((data) => setProjects(data as ProjectWithId[]))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleDelete = async (item: ProjectWithId) => {
    setDeleteTarget(item);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.projects.delete(deleteTarget.id);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success("Projet supprimé");
    } finally {
      setDeleteTarget(null);
    }
  };

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
        p.featured ? <StatusBadge variant="featured">Oui</StatusBadge> : "—",
    },
    { key: "date", header: "Date", render: (p: ProjectWithId) => p.date },
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
          data={projects}
          onEdit={(p) => setEditingProject(p)}
          onDelete={handleDelete}
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
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Modal
        isOpen={!!editingProject || isCreating}
        onClose={() => {
          setEditingProject(null);
          setIsCreating(false);
        }}
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
