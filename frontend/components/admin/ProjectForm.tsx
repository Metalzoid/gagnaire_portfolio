"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import { TechnologySearch } from "./TechnologySearch";
import { ProjectImageManager } from "./ProjectImageManager";
import { Button } from "@/components/ui/button";
import type { CreateProjectSchemaType, ProjectImage } from "shared";

interface ProjectFormProps {
  defaultValues?: Partial<CreateProjectSchemaType> & {
    id?: string;
    images?: ProjectImage[];
  };
  onSubmit: (data: CreateProjectSchemaType) => Promise<void>;
  onImagesChange?: (images: ProjectImage[]) => void;
  submitLabel?: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function ProjectForm({
  defaultValues,
  onSubmit,
  onImagesChange,
  submitLabel = "Enregistrer",
}: ProjectFormProps) {
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [description, setDescription] = useState(
    defaultValues?.description ?? "",
  );
  const [longDescription, setLongDescription] = useState(
    defaultValues?.longDescription ?? "",
  );
  const [technologyIds, setTechnologyIds] = useState<string[]>(
    defaultValues?.technologyIds ?? [],
  );
  const [category, setCategory] = useState(defaultValues?.category ?? "");
  const [images, setImages] = useState<ProjectImage[]>(
    defaultValues?.images ?? [],
  );
  const [github, setGithub] = useState(defaultValues?.github ?? "");
  const [demo, setDemo] = useState(defaultValues?.demo ?? "");
  const [featured, setFeatured] = useState(defaultValues?.featured ?? false);
  const [date, setDate] = useState(defaultValues?.date ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!defaultValues?.slug) setSlug(slugify(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit({
        slug: slug || slugify(title),
        title,
        description,
        longDescription,
        technologyIds,
        category,
        github: github || null,
        demo: demo || null,
        featured,
        date,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Titre"
        name="title"
        value={title}
        onChange={(e) =>
          handleTitleChange(e as React.ChangeEvent<HTMLInputElement>)
        }
        required
      />
      <FormField
        label="Slug"
        name="slug"
        value={slug}
        onChange={(e) => setSlug((e.target as HTMLInputElement).value)}
        placeholder="auto-généré depuis le titre"
      />
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
      <FormField
        type="textarea"
        label="Description longue"
        name="longDescription"
        value={longDescription}
        onChange={(e) =>
          setLongDescription((e.target as HTMLTextAreaElement).value)
        }
        required
      />
      <FormField
        label="Catégorie"
        name="category"
        value={category}
        onChange={(e) => setCategory((e.target as HTMLInputElement).value)}
        required
      />
      <TechnologySearch
        value={technologyIds}
        onChange={setTechnologyIds}
        label="Technologies"
        placeholder="Rechercher ou ajouter une technologie"
      />
      {defaultValues?.id ? (
        <ProjectImageManager
          projectId={defaultValues.id}
          images={images}
          onImagesChange={(newImages) => {
            setImages(newImages);
            onImagesChange?.(newImages);
          }}
        />
      ) : (
        <p className="admin-form-hint">
          Créez d&apos;abord le projet, puis ajoutez des images en
          l&apos;éditant.
        </p>
      )}
      <FormField
        label="GitHub"
        name="github"
        type="url"
        value={github}
        onChange={(e) => setGithub((e.target as HTMLInputElement).value)}
      />
      <FormField
        label="Démo"
        name="demo"
        type="url"
        value={demo}
        onChange={(e) => setDemo((e.target as HTMLInputElement).value)}
      />
      <FormField
        label="Date"
        name="date"
        value={date}
        onChange={(e) => setDate((e.target as HTMLInputElement).value)}
        placeholder="YYYY-MM"
        required
      />
      <div className="form-field">
        <label>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />{" "}
          Mettre en avant (featured)
        </label>
      </div>
      {error && (
        <p
          style={{
            color: "var(--color-error)",
            marginBottom: "var(--spacing-md)",
          }}
        >
          {error}
        </p>
      )}
      <Button
        type="submit"
        loading={loading}
        disabled={loading}
        ariaLabel={submitLabel}
      >
        {loading ? "Enregistrement..." : submitLabel}
      </Button>
    </form>
  );
}
