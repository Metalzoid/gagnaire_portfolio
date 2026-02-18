"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/services/admin-api";
import { SkillForm } from "@/components/admin/SkillForm";
import { OrderableList } from "@/components/admin/OrderableList";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import { FormField } from "@/components/admin/FormField";
import type { SkillCategory, Skill } from "shared";
import type {
  CreateSkillSchemaType,
  CreateSkillCategorySchemaType,
} from "shared";

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
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingSkillIn, setAddingSkillIn] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<SkillWithId | null>(null);
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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    try {
      const created = (await adminApi.skills.createCategory({
        name,
      } as CreateSkillCategorySchemaType)) as unknown as SkillCategoryWithIds;
      setCategories((prev) => [...prev, { ...created, skills: [] }]);
      setNewCategoryName("");
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

  const handleAddSkill = async (
    categoryId: string,
    data: CreateSkillSchemaType,
  ) => {
    try {
      await adminApi.skills.create({ ...data, categoryId });
      load();
      setAddingSkillIn(null);
      toast.success("Compétence ajoutée");
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateSkill = async (id: string, data: CreateSkillSchemaType) => {
    try {
      await adminApi.skills.update(id, data);
      load();
      setEditingSkill(null);
      toast.success("Compétence modifiée");
    } catch (err) {
      throw err;
    }
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
    categoryId: string,
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
      <div className="admin-skills-accordion__add-category">
        <form
          className="admin-skills-accordion__add-category-form"
          onSubmit={handleAddCategory}
        >
          <div className="admin-skills-accordion__add-category-field">
            <FormField
              label="Nouvelle catégorie"
              name="newCategory"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Ex: Frontend"
            />
          </div>
          <Button type="submit" ariaLabel="Ajouter la catégorie">
            Ajouter catégorie
          </Button>
        </form>
      </div>

      {categories.length === 0 ? (
        <p>Aucune catégorie. Ajoutez-en une pour commencer.</p>
      ) : (
        <div className="admin-skills-accordion">
          {categories.map((cat) => (
            <div key={cat.id} className="admin-skills-accordion__category">
              <div
                className="admin-skills-accordion__header"
                onClick={() =>
                  setExpandedCategory((prev) =>
                    prev === cat.id ? null : cat.id,
                  )
                }
              >
                <span className="admin-skills-accordion__title">
                  {cat.name}
                </span>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--spacing-sm)",
                    alignItems: "center",
                  }}
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddingSkillIn((prev) =>
                        prev === cat.id ? null : cat.id,
                      );
                    }}
                    ariaLabel="Ajouter une compétence"
                  >
                    + Skill
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({
                        type: "category",
                        id: cat.id,
                        name: cat.name,
                      });
                    }}
                    ariaLabel={`Supprimer la catégorie ${cat.name}`}
                  >
                    Suppr.
                  </Button>
                </div>
              </div>

              {expandedCategory === cat.id && (
                <div className="admin-skills-accordion__body">
                  {addingSkillIn === cat.id && (
                    <SkillForm
                      categoryId={cat.id}
                      hideCategory
                      onSubmit={(data) =>
                        handleAddSkill(cat.id, data as CreateSkillSchemaType)
                      }
                      onCancel={() => setAddingSkillIn(null)}
                      submitLabel="Ajouter"
                    />
                  )}

                  {cat.skills.length === 0 && addingSkillIn !== cat.id ? (
                    <p
                      style={{
                        color: "var(--color-text-secondary)",
                        fontStyle: "italic",
                      }}
                    >
                      Aucune compétence. Cliquez sur &quot;+ Skill&quot; pour en
                      ajouter.
                    </p>
                  ) : (
                    <OrderableList<SkillWithId>
                      items={cat.skills.map((s) => ({
                        id: s.id,
                        data: s,
                      }))}
                      onReorder={(items) =>
                        handleReorderSkills(
                          cat.id,
                          items as { id: string; data: SkillWithId }[],
                        )
                      }
                      renderItem={({ data }) => (
                        <div className="admin-skills-accordion__skill-row">
                          {editingSkill?.id === data.id ? (
                            <SkillForm
                              categoryId={cat.id}
                              hideCategory
                              defaultValues={data}
                              onSubmit={(d) =>
                                handleUpdateSkill(
                                  data.id,
                                  d as CreateSkillSchemaType,
                                )
                              }
                              onCancel={() => setEditingSkill(null)}
                              submitLabel="Modifier"
                            />
                          ) : (
                            <>
                              <span style={{ flex: 1 }}>{data.name}</span>
                              <span>Niveau: {data.level}%</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingSkill(data)}
                                ariaLabel="Modifier"
                              >
                                Modifier
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: "skill",
                                    id: data.id,
                                    name: data.name,
                                  })
                                }
                                ariaLabel={`Supprimer ${data.name}`}
                              >
                                Suppr.
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    />
                  )}
                </div>
              )}
            </div>
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
