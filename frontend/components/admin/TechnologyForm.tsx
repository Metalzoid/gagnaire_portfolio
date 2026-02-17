"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "Frontend",
  "Backend",
  "DevOps",
  "Base de données",
  "Outils",
  "Mobile",
  "Autre",
];

export interface TechnologyFormData {
  name: string;
  icon: string | null;
  category: string | null;
}

interface TechnologyFormProps {
  defaultValues?: Partial<TechnologyFormData>;
  onSubmit: (data: TechnologyFormData) => Promise<void>;
  submitLabel?: string;
  onCancel?: () => void;
}

export function TechnologyForm({
  defaultValues,
  onSubmit,
  submitLabel = "Enregistrer",
  onCancel,
}: TechnologyFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [icon, setIcon] = useState(defaultValues?.icon ?? "");
  const [category, setCategory] = useState(defaultValues?.category ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Le nom est requis");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit({
        name: trimmedName,
        icon: icon.trim() || null,
        category: category || null,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Nom"
        name="name"
        value={name}
        onChange={(e) => setName((e.target as HTMLInputElement).value)}
        required
      />
      <FormField
        label="Icône (chemin ou slug)"
        name="icon"
        value={icon}
        onChange={(e) => setIcon((e.target as HTMLInputElement).value)}
      />
      <div className="form-field" style={{ marginBottom: "var(--spacing-md)" }}>
        <label>Catégorie</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: "100%",
            padding: "var(--spacing-sm)",
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--border-radius)",
          }}
        >
          <option value="">Aucune</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p
          style={{
            color: "var(--color-error)",
            marginBottom: "var(--spacing-sm)",
          }}
          role="alert"
        >
          {error}
        </p>
      )}
      <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            ariaLabel="Annuler"
          >
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={saving} ariaLabel={submitLabel}>
          {saving ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
