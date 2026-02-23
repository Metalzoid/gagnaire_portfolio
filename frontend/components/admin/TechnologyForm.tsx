"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import { FileUpload } from "./FileUpload";
import { FormError } from "./FormError";
import { Button } from "@/components/ui/button";
import { IconPicker } from "./icon-picker";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { getUploadUrl } from "@/utils/url";
import { isImagePath } from "@/utils/image";
import { TECHNOLOGY_CATEGORIES } from "@/data/technology-categories";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import styles from "./TechnologyForm.module.scss";

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
  const [icon, setIcon] = useState<string | null>(defaultValues?.icon ?? null);
  const [category, setCategory] = useState(defaultValues?.category ?? "");
  const [mode, setMode] = useState<"icon" | "image">(() =>
    defaultValues?.icon && isImagePath(defaultValues.icon) ? "image" : "icon",
  );
  const { error, setError, loading, handleSubmit } = useFormSubmit({
    validate: () => (!name.trim() ? "Le nom est requis" : null),
  });

  const handleIconChange = (value: string | null) => {
    setIcon(value);
    setMode("icon");
  };

  const clearIcon = () => setIcon(null);

  const imageUrl = icon && isImagePath(icon) ? getUploadUrl(icon) : null;

  return (
    <form onSubmit={handleSubmit(() => onSubmit({
        name: name.trim(),
        icon,
        category: category || null,
      }))} className={styles.form}>
      <FormField
        label="Nom"
        name="name"
        value={name}
        onChange={(e) => setName((e.target as HTMLInputElement).value)}
        required
      />

      <div className={styles.iconSection}>
        <label className={styles.sectionLabel}>Icône</label>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === "icon" ? styles.tabActive : ""}`}
            onClick={() => setMode("icon")}
            aria-pressed={mode === "icon"}
          >
            React Icon
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === "image" ? styles.tabActive : ""}`}
            onClick={() => setMode("image")}
            aria-pressed={mode === "image"}
          >
            Image uploadée
          </button>
        </div>

        {mode === "icon" && (
          <IconPicker
            label=""
            value={icon && !isImagePath(icon) ? icon : null}
            onChange={handleIconChange}
          />
        )}

        {mode === "image" && (
          <div className={styles.imageUpload}>
            {imageUrl ? (
              <div className={styles.imagePreview}>
                <ImageWithFallback
                  src={imageUrl}
                  alt="Aperçu icône technologie"
                  width={48}
                  height={48}
                  unoptimized
                />
                <span className={styles.imagePath}>{icon}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearIcon}
                  ariaLabel="Supprimer l'image"
                >
                  Supprimer
                </Button>
              </div>
            ) : (
              <FileUpload
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                category="technology-icon"
                size="sm"
                onComplete={(path) => {
                  setIcon(path);
                  setMode("image");
                }}
                onError={setError}
                label="Choisir un fichier (SVG, PNG, WebP, JPEG)"
                ariaLabel="Uploader une image"
              />
            )}
          </div>
        )}
      </div>

      <div className={styles.formField}>
        <label className={styles.label}>Catégorie</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.select}
        >
          <option value="">Aucune</option>
          {TECHNOLOGY_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <FormError error={error} />

      <div className={styles.actions}>
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
        <Button type="submit" disabled={loading} ariaLabel={submitLabel}>
          {loading ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
