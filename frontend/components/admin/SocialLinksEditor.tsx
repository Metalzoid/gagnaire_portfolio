"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import { OrderableList } from "./OrderableList";
import { Button } from "@/components/ui/button";
import type { SocialLink } from "shared";

interface SocialLinksEditorProps {
  value: SocialLink[];
  onChange: (social: SocialLink[]) => void;
  onReorder?: (social: SocialLink[]) => void | Promise<void>;
}

export function SocialLinksEditor({
  value,
  onChange,
  onReorder,
}: SocialLinksEditorProps) {
  const [ids, setIds] = useState<string[]>(() =>
    value.map(() => crypto.randomUUID()),
  );

  const handleFieldChange = (
    index: number,
    field: keyof SocialLink,
    fieldValue: string,
  ) => {
    const next = [...value];
    next[index] = { ...next[index], [field]: fieldValue };
    onChange(next);
  };

  return (
    <section className="admin-profile-form__section admin-profile-form__section--social">
      <h3 className="admin-profile-form__title">Réseaux sociaux</h3>
      <OrderableList<SocialLink>
        items={value.map((s, i) => ({
          id: ids[i] ?? crypto.randomUUID(),
          data: s,
        }))}
        onReorder={(items) => {
          const nextData = items.map((item) => item.data);
          const nextIds = items.map((item) => item.id);
          onChange(nextData);
          setIds(nextIds);
          onReorder?.(nextData);
        }}
        renderItem={({ data, id }) => {
          const idx = ids.indexOf(id);
          if (idx < 0) return null;
          return (
            <div className="admin-profile-form__social-item">
              <div className="admin-profile-form__social-fields">
                <FormField
                  label="Label"
                  name={`social.${idx}.label`}
                  value={data.label}
                  onChange={(e) =>
                    handleFieldChange(
                      idx,
                      "label",
                      (e.target as HTMLInputElement).value,
                    )
                  }
                />
                <FormField
                  label="Valeur"
                  name={`social.${idx}.url`}
                  value={data.url}
                  onChange={(e) =>
                    handleFieldChange(
                      idx,
                      "url",
                      (e.target as HTMLInputElement).value,
                    )
                  }
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange(value.filter((_, i) => i !== idx));
                  setIds(ids.filter((_, i) => i !== idx));
                }}
                ariaLabel="Supprimer le lien"
                className="admin-profile-form__social-remove"
              >
                Supprimer
              </Button>
            </div>
          );
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          onChange([...value, { label: "", url: "" }]);
          setIds([...ids, crypto.randomUUID()]);
        }}
        ariaLabel="Ajouter un lien"
        className="admin-profile-form__social-add"
      >
        + Ajouter un lien
      </Button>
    </section>
  );
}
