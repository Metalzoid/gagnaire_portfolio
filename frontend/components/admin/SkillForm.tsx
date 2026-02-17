"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/button";
import { IconPicker } from "./icon-picker";
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const effectiveCategoryId = hideCategory ? categoryId : selectedCategoryId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const catId = effectiveCategoryId;
      const data: CreateSkillSchemaType | UpdateSkillSchemaType = {
        name: name.trim(),
        level,
        icon: icon.trim() || undefined,
        ...(hideCategory ? {} : { categoryId: catId }),
      };
      if (!hideCategory && !catId) {
        setError("Sélectionnez une catégorie");
        return;
      }
      if (!name.trim()) {
        setError("Le nom est requis");
        return;
      }
      await onSubmit(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-skill-form">
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
      {error && (
        <p className="admin-form-error" role="alert">
          {error}
        </p>
      )}
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
