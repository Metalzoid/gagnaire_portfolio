"use client";

import { useProjectFilters } from "@/hooks/useProjectFilters";
import { ProjectGrid, ProjectFilters } from "@/components/projects";
import { Container } from "@/components/ui/container";
import type { Project } from "shared";
import styles from "@/app/projects/projects.module.scss";

export function ProjectsContent({ projects }: { projects: Project[] }) {
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
