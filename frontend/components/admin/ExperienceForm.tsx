"use client";

import { useState } from "react";
import { DatePicker } from "./DatePicker";
import { FormField } from "./FormField";
import { TechnologySearch } from "./TechnologySearch";
import { Button } from "@/components/ui/button";
import type { CreateExperienceSchemaType } from "shared";

interface ExperienceFormProps {
  defaultValues?: Partial<CreateExperienceSchemaType> & { id?: string };
  onSubmit: (data: CreateExperienceSchemaType) => Promise<void>;
  submitLabel?: string;
}

export function ExperienceForm({
  defaultValues,
  onSubmit,
  submitLabel = "Enregistrer",
}: ExperienceFormProps) {
  const [type, setType] = useState<"work" | "education" | "alternance">(
    (defaultValues?.type as "work" | "education" | "alternance") ?? "work",
  );
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [company, setCompany] = useState(defaultValues?.company ?? "");
  const [location, setLocation] = useState(defaultValues?.location ?? "");
  const [startDate, setStartDate] = useState(defaultValues?.startDate ?? "");
  const [endDate, setEndDate] = useState(defaultValues?.endDate ?? "");
  const [current, setCurrent] = useState(defaultValues?.current ?? false);
  const [description, setDescription] = useState(
    defaultValues?.description ?? "",
  );
  const [technologyIds, setTechnologyIds] = useState<string[]>(
    defaultValues?.technologyIds ?? [],
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit({
        type,
        title,
        company: company || undefined,
        location: location || undefined,
        startDate,
        endDate: current ? undefined : endDate || null,
        current,
        description,
        technologyIds,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Type"
        name="type"
        options={[
          { value: "work", label: "Travail" },
          { value: "education", label: "Formation" },
          { value: "alternance", label: "Formation en alternance" },
        ]}
        value={type}
        onChange={(e) =>
          setType((e.target as HTMLSelectElement).value as "work" | "education" | "alternance")
        }
        required
      />
      <FormField
        label="Titre"
        name="title"
        value={title}
        onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
        required
      />
      <FormField
        label="Entreprise"
        name="company"
        value={company}
        onChange={(e) => setCompany((e.target as HTMLInputElement).value)}
      />
      <FormField
        label="Lieu"
        name="location"
        value={location}
        onChange={(e) => setLocation((e.target as HTMLInputElement).value)}
      />
      <DatePicker
        label="Date de début"
        name="startDate"
        value={startDate}
        onChange={setStartDate}
        mode="month"
        placeholder="Sélectionner un mois"
        ariaLabel="Date de début"
        required
      />
      <div className="form-field">
        <label>
          <input
            type="checkbox"
            checked={current}
            onChange={(e) => setCurrent(e.target.checked)}
          />{" "}
          Poste actuel
        </label>
      </div>
      {!current && (
        <DatePicker
          label="Date de fin"
          name="endDate"
          value={endDate}
          onChange={setEndDate}
          mode="month"
          placeholder="Sélectionner un mois"
          ariaLabel="Date de fin"
          allowEmpty
        />
      )}
      <FormField
        type="textarea"
        label="Description"
        name="description"
        value={description}
        onChange={(e) =>
          setDescription((e.target as HTMLTextAreaElement).value)
        }
        required
      />
      <TechnologySearch
        value={technologyIds}
        onChange={setTechnologyIds}
        label="Technologies"
        placeholder="Rechercher ou ajouter une technologie"
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
