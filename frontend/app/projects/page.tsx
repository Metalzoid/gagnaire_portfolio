"use client";

import { useMemo, Suspense } from "react";
import { getProjects } from "@/services/data";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { ProjectGrid, ProjectFilters } from "@/components/projects";
import { Container } from "@/components/ui/container";
import styles from "./projects.module.scss";

function ProjectsContent() {
  const projects = useMemo(() => getProjects(), []);
  const { allTags, selectedTags, filteredProjects, toggleTag, clearFilters } =
    useProjectFilters(projects);

  return (
    <div className={`page page--projects ${styles.page}`}>
      <Container>
        <header className={styles.header}>
          <h1 className={styles.title}>Mes projets</h1>
          <p className={styles.intro}>
            Une sélection de mes réalisations, de l&apos;intégration au
            fullstack.
          </p>
        </header>

        <ProjectFilters
          allTags={allTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          onClear={clearFilters}
        />

        <ProjectGrid projects={filteredProjects} />
      </Container>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className={styles.page}>Chargement...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
