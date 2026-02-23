"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import { FileUpload } from "./FileUpload";
import { FormError } from "./FormError";
import { Button } from "@/components/ui/button";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import type { CreateTestimonialSchemaType } from "shared";
import formFieldStyles from "./FormField.module.scss";
import styles from "./TestimonialForm.module.scss";

interface TestimonialFormProps {
  defaultValues?: Partial<CreateTestimonialSchemaType> & { id?: string };
  onSubmit: (data: CreateTestimonialSchemaType) => Promise<void>;
  submitLabel?: string;
}

export function TestimonialForm({
  defaultValues,
  onSubmit,
  submitLabel = "Enregistrer",
}: TestimonialFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [role, setRole] = useState(defaultValues?.role ?? "");
  const [company, setCompany] = useState(defaultValues?.company ?? "");
  const [quote, setQuote] = useState(defaultValues?.quote ?? "");
  const [photo, setPhoto] = useState(defaultValues?.photo ?? "");
  const { error, loading, handleSubmit } = useFormSubmit();

  return (
    <form onSubmit={handleSubmit(() => onSubmit({ name, role, company, quote, photo }))}>
      <FormField
        label="Nom"
        name="name"
        value={name}
        onChange={(e) => setName((e.target as HTMLInputElement).value)}
        required
      />
      <FormField
        label="Rôle"
        name="role"
        value={role}
        onChange={(e) => setRole((e.target as HTMLInputElement).value)}
        required
      />
      <FormField
        label="Entreprise"
        name="company"
        value={company}
        onChange={(e) => setCompany((e.target as HTMLInputElement).value)}
        required
      />
      <FormField
        type="textarea"
        label="Citation"
        name="quote"
        value={quote}
        onChange={(e) => setQuote((e.target as HTMLTextAreaElement).value)}
        required
      />
      <div className={styles.photoField}>
        <label className={formFieldStyles.label}>
          Photo <span className={formFieldStyles.required}>*</span>
        </label>
        <FileUpload
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          category="testimonial-photo"
          value={photo}
          showPreview
          previewShape="circle"
          onComplete={setPhoto}
          label="Choisir un fichier"
          ariaLabel="Changer la photo"
        />
      </div>
      <FormError error={error} />
      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        ariaLabel={submitLabel}
      >
        {loading ? "..." : submitLabel}
      </Button>
    </form>
  );
}
