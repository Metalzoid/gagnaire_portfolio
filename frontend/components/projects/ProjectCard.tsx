"use client";

import Link from "next/link";
import { ImageWithFallback, PLACEHOLDER_PROJECT_IMAGE } from "@/components/ui/image-with-fallback";
import { Tag } from "@/components/ui/tag";
import type { Project } from "@/types";
import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const imageSrc = project.images?.main || PLACEHOLDER_PROJECT_IMAGE;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={styles.card}
      aria-label={`Voir le projet ${project.title}`}
    >
      <div className={styles.imageWrapper}>
        <ImageWithFallback
          src={imageSrc}
          alt={project.title}
          fill
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
          className={styles.image}
        />
        <div className={styles.overlay}>
          <span className={styles.overlayText}>Voir le projet</span>
        </div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description} title={project.description}>
          {project.description}
        </p>
        {project.technologies && project.technologies.length > 0 && (
          <div className={styles.tags}>
            {project.technologies.slice(0, 4).map((tech: string) => (
              <Tag key={tech} label={tech} variant="tech" />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
