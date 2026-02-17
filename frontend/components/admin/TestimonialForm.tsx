"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import { FileField } from "./FileField";
import { Button } from "@/components/ui/button";
import type { CreateTestimonialSchemaType } from "shared";

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit({ name, role, company, quote, photo });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
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
      <FileField
        label="Photo"
        name="photo"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        category="testimonial-photo"
        value={photo}
        onUpload={setPhoto}
        preview
        required
      />
      {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
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
