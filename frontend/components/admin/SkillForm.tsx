"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import { FormError } from "./FormError";
import { Button } from "@/components/ui/button";
import { IconPicker } from "./icon-picker";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { CreateSkillSchemaType, UpdateSkillSchemaType } from "shared";

interface SkillFormProps {
  categoryId: string;
  categoryOptions?: { value: string; label: string }[];
  defaultValues?: Partial<CreateSkillSchemaType> & { id?: string };
  onSubmit: (
    data: CreateSkillSchemaType | UpdateSkillSchemaType,
  ) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  /** Si true, masque le select catégorie (édition inline dans une catégorie) */
  hideCategory?: boolean;
}

export function SkillForm({
  categoryId,
  categoryOptions = [],
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Enregistrer",
  hideCategory = true,
}: SkillFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categoryId || (categoryOptions[0]?.value ?? ""),
  );
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [level, setLevel] = useState(defaultValues?.level ?? 50);
  const [icon, setIcon] = useState(defaultValues?.icon ?? "");

  const effectiveCategoryId = hideCategory ? categoryId : selectedCategoryId;

  const { error, loading, handleSubmit } = useFormSubmit({
    validate: () => {
      if (!hideCategory && !effectiveCategoryId) return "Sélectionnez une catégorie";
      if (!name.trim()) return "Le nom est requis";
      return null;
    },
  });

  return (
    <form onSubmit={handleSubmit(() => onSubmit({
        name: name.trim(),
        level,
        icon: icon.trim() || undefined,
        ...(hideCategory ? {} : { categoryId: effectiveCategoryId }),
      }))} className="admin-skill-form">
      <div className="admin-skill-form__row">
        {!hideCategory && categoryOptions.length > 0 && (
          <FormField
            label="Catégorie"
            name="category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            options={categoryOptions}
            required
          />
        )}
        <FormField
          type="text"
          label="Nom"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Ex: React"
        />
        <div className="admin-skill-form__level">
          <label>
            Niveau : {level}%
            <input
              type="range"
              min={0}
              max={100}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="admin-skill-form__slider"
            />
          </label>
        </div>
        <IconPicker
          label="Icône (optionnel)"
          value={icon || null}
          onChange={(v) => setIcon(v ?? "")}
        />
      </div>
      <FormError error={error} />
      <div className="admin-skill-form__actions">
        <Button type="submit" loading={loading} disabled={loading}>
          {loading ? "Enregistrement…" : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}
