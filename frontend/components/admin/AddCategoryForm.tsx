"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import { Button } from "@/components/ui/button";

interface AddCategoryFormProps {
  onAdd: (name: string) => Promise<void>;
}

export function AddCategoryForm({ onAdd }: AddCategoryFormProps) {
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    await onAdd(name);
    setNewCategoryName("");
  };

  return (
    <div className="admin-skills-accordion__add-category">
      <form
        className="admin-skills-accordion__add-category-form"
        onSubmit={handleSubmit}
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
  );
}
