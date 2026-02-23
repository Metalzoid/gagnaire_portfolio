"use client";

import { useState } from "react";
import { SkillForm } from "./SkillForm";
import { OrderableList } from "./OrderableList";
import { Button } from "@/components/ui/button";
import type { Skill } from "shared";
import type { CreateSkillSchemaType } from "shared";

type SkillWithId = Skill & { id: string; categoryId: string; order: number };

interface SkillCategoryAccordionProps {
  categoryId: string;
  categoryName: string;
  skills: SkillWithId[];
  isExpanded: boolean;
  onToggle: () => void;
  onDeleteCategory: () => void;
  onAddSkill: (categoryId: string, data: CreateSkillSchemaType) => Promise<void>;
  onUpdateSkill: (id: string, data: CreateSkillSchemaType) => Promise<void>;
  onDeleteSkill: (id: string, name: string) => void;
  onReorderSkills: (
    categoryId: string,
    items: { id: string; data: SkillWithId }[],
  ) => Promise<void>;
}

export function SkillCategoryAccordion({
  categoryId,
  categoryName,
  skills,
  isExpanded,
  onToggle,
  onDeleteCategory,
  onAddSkill,
  onUpdateSkill,
  onDeleteSkill,
  onReorderSkills,
}: SkillCategoryAccordionProps) {
  const [addingSkill, setAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillWithId | null>(null);

  return (
    <div className="admin-skills-accordion__category">
      <div className="admin-skills-accordion__header" onClick={onToggle}>
        <span className="admin-skills-accordion__title">{categoryName}</span>
        <div className="admin-skills-accordion__header-actions">
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setAddingSkill((prev) => !prev);
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
              onDeleteCategory();
            }}
            ariaLabel={`Supprimer la catégorie ${categoryName}`}
          >
            Suppr.
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="admin-skills-accordion__body">
          {addingSkill && (
            <SkillForm
              categoryId={categoryId}
              hideCategory
              onSubmit={async (data) => {
                await onAddSkill(categoryId, data as CreateSkillSchemaType);
                setAddingSkill(false);
              }}
              onCancel={() => setAddingSkill(false)}
              submitLabel="Ajouter"
            />
          )}

          {skills.length === 0 && !addingSkill ? (
            <p className="admin-skills-accordion__empty">
              Aucune compétence. Cliquez sur &quot;+ Skill&quot; pour en ajouter.
            </p>
          ) : (
            <OrderableList<SkillWithId>
              items={skills.map((s) => ({ id: s.id, data: s }))}
              onReorder={(items) =>
                onReorderSkills(
                  categoryId,
                  items as { id: string; data: SkillWithId }[],
                )
              }
              renderItem={({ data }) => (
                <div className="admin-skills-accordion__skill-row">
                  {editingSkill?.id === data.id ? (
                    <SkillForm
                      categoryId={categoryId}
                      hideCategory
                      defaultValues={data}
                      onSubmit={async (d) => {
                        await onUpdateSkill(data.id, d as CreateSkillSchemaType);
                        setEditingSkill(null);
                      }}
                      onCancel={() => setEditingSkill(null)}
                      submitLabel="Modifier"
                    />
                  ) : (
                    <>
                      <span className="admin-skills-accordion__skill-name">
                        {data.name}
                      </span>
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
                        onClick={() => onDeleteSkill(data.id, data.name)}
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
  );
}
