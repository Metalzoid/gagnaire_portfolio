import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectTechStack } from "./ProjectTechStack";
import { ProjectNav } from "./ProjectNav";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";
import styles from "./ProjectDetail.module.scss";

interface ProjectDetailProps {
  project: Project;
  prevSlug: string | null;
  nextSlug: string | null;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const months: Record<string, string> = {
    "01": "Jan",
    "02": "Fév",
    "03": "Mar",
    "04": "Avr",
    "05": "Mai",
    "06": "Juin",
    "07": "Juil",
    "08": "Août",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Déc",
  };
  return `${months[month] || month} ${year}`;
}

export function ProjectDetail({
  project,
  prevSlug,
  nextSlug,
}: ProjectDetailProps) {
  const dateFormatted = formatDate(project.date);

  return (
    <article className={styles.wrapper}>
      <ProjectNav prevSlug={prevSlug} nextSlug={nextSlug} />
      <ProjectGallery images={project.images} title={project.title} />

      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        {dateFormatted && (
          <time dateTime={project.date} className={styles.date}>
            {dateFormatted}
          </time>
        )}
      </header>

      <div className={styles.description}>
        {project.longDescription.split("\n\n").map((para: string, i: number) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {project.technologies?.length > 0 && (
        <div className={styles.techStack}>
          <h3 className={styles.techTitle}>Stack technique</h3>
          <ProjectTechStack technologies={project.technologies} />
        </div>
      )}

      {(project.github || project.demo) && (
        <div className={styles.links}>
          {project.github && (
            <Button
              href={project.github}
              variant="outline"
              icon={<FaGithub />}
              ariaLabel="Voir sur GitHub"
            >
              GitHub
            </Button>
          )}
          {project.demo && (
            <Button
              href={project.demo}
              variant="primary"
              icon={<FaExternalLinkAlt />}
              ariaLabel="Voir la démo"
            >
              Demo
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
