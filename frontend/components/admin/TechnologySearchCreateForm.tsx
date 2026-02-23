"use client";

import { useState } from "react";
import { adminApi } from "@/services/admin-api";
import { TECHNOLOGY_CATEGORIES } from "@/data/technology-categories";
import { FormError } from "./FormError";
import type { Technology } from "shared";
import styles from "./TechnologySearch.module.scss";

interface TechnologySearchCreateFormProps {
  initialName: string;
  onCreated: (tech: Technology) => void;
  onCancel: () => void;
}

export function TechnologySearchCreateForm({
  initialName,
  onCreated,
  onCancel,
}: TechnologySearchCreateFormProps) {
  const [createName, setCreateName] = useState(initialName);
  const [createIcon, setCreateIcon] = useState("");
  const [createCategory, setCreateCategory] = useState("");
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const handleCreate = async () => {
    const name = createName.trim();
    if (!name) {
      setCreateError("Le nom est requis");
      return;
    }
    setCreateError("");
    setCreateLoading(true);
    try {
      const tech = await adminApi.technologies.create({
        name,
        icon: createIcon.trim() || null,
        category: createCategory || null,
      });
      onCreated(tech);
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Erreur lors de la création",
      );
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className={styles.createForm}>
      <h4 className={styles.createTitle}>Nouvelle technologie</h4>
      <input
        type="text"
        value={createName}
        onChange={(e) => setCreateName(e.target.value)}
        placeholder="Nom"
        className={styles.input}
        required
      />
      <input
        type="text"
        value={createIcon}
        onChange={(e) => setCreateIcon(e.target.value)}
        placeholder="Icône (chemin ou slug)"
        className={styles.input}
      />
      <select
        value={createCategory}
        onChange={(e) => setCreateCategory(e.target.value)}
        className={styles.select}
      >
        <option value="">Catégorie (optionnel)</option>
        {TECHNOLOGY_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <FormError error={createError} />
      <div className={styles.createActions}>
        <button type="button" onClick={onCancel}>
          Annuler
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={createLoading || !createName.trim()}
        >
          {createLoading ? "Création..." : "Créer"}
        </button>
      </div>
    </div>
  );
}
