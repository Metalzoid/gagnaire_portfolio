"use client";

import { ProjectCard } from "./ProjectCard";
import type { Project } from "shared";
import styles from "./ProjectGrid.module.scss";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <div key={project.slug} className={styles.gridItem}>
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
