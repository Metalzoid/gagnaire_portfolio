"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/services/admin-api";
import { AddCategoryForm } from "@/components/admin/AddCategoryForm";
import { SkillCategoryAccordion } from "@/components/admin/SkillCategoryAccordion";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/contexts/ToastContext";
import type { SkillCategory, Skill } from "shared";
import type { CreateSkillSchemaType, CreateSkillCategorySchemaType } from "shared";

type SkillWithId = Skill & { id: string; categoryId: string; order: number };
type SkillCategoryWithIds = Omit<SkillCategory, "skills"> & {
  id: string;
  order: number;
  skills: SkillWithId[];
};

export default function AdminSkillsPage() {
  const toast = useToast();
  const [categories, setCategories] = useState<SkillCategoryWithIds[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<
    | { type: "category"; id: string; name: string }
    | { type: "skill"; id: string; name: string }
    | null
  >(null);

  const load = useCallback(() => {
    setLoading(true);
    adminApi.skills
      .list()
      .then((data) => {
        const cats = data as SkillCategoryWithIds[];
        setCategories(cats);
        if (cats.length > 0) setExpandedCategory((prev) => prev ?? cats[0].id);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => load(), [load]);

  const handleAddCategory = async (name: string) => {
    try {
      const created = (await adminApi.skills.createCategory({
        name,
      } as CreateSkillCategorySchemaType)) as unknown as SkillCategoryWithIds;
      setCategories((prev) => [...prev, { ...created, skills: [] }]);
      setExpandedCategory(created.id);
      toast.success("Catégorie ajoutée");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await adminApi.skills.deleteCategory(id);
      const next = categories.filter((c) => c.id !== id);
      setCategories(next);
      if (expandedCategory === id) setExpandedCategory(next[0]?.id ?? null);
      toast.success("Catégorie supprimée");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleAddSkill = async (categoryId: string, data: CreateSkillSchemaType) => {
    await adminApi.skills.create({ ...data, categoryId });
    load();
    toast.success("Compétence ajoutée");
  };

  const handleUpdateSkill = async (id: string, data: CreateSkillSchemaType) => {
    await adminApi.skills.update(id, data);
    load();
    toast.success("Compétence modifiée");
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await adminApi.skills.delete(id);
      load();
      toast.success("Compétence supprimée");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleReorderSkills = async (
    _categoryId: string,
    items: { id: string; data: SkillWithId }[],
  ) => {
    try {
      await Promise.all(
        items.map((item, index) =>
          adminApi.skills.update(item.id, { order: index }),
        ),
      );
      load();
      toast.success("Ordre enregistré");
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "category")
      await handleDeleteCategory(deleteTarget.id);
    else await handleDeleteSkill(deleteTarget.id);
  };

  if (loading && categories.length === 0) return <p>Chargement...</p>;

  return (
    <div>
      <AddCategoryForm onAdd={handleAddCategory} />

      {categories.length === 0 ? (
        <p>Aucune catégorie. Ajoutez-en une pour commencer.</p>
      ) : (
        <div className="admin-skills-accordion">
          {categories.map((cat) => (
            <SkillCategoryAccordion
              key={cat.id}
              categoryId={cat.id}
              categoryName={cat.name}
              skills={cat.skills}
              isExpanded={expandedCategory === cat.id}
              onToggle={() =>
                setExpandedCategory((prev) =>
                  prev === cat.id ? null : cat.id,
                )
              }
              onDeleteCategory={() =>
                setDeleteTarget({
                  type: "category",
                  id: cat.id,
                  name: cat.name,
                })
              }
              onAddSkill={handleAddSkill}
              onUpdateSkill={handleUpdateSkill}
              onDeleteSkill={(id, name) =>
                setDeleteTarget({ type: "skill", id, name })
              }
              onReorderSkills={handleReorderSkills}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Confirmer la suppression"
        message={
          deleteTarget
            ? deleteTarget.type === "category"
              ? `Supprimer la catégorie "${deleteTarget.name}" et toutes ses compétences ?`
              : `Supprimer la compétence "${deleteTarget.name}" ?`
            : ""
        }
        confirmLabel="Supprimer"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
