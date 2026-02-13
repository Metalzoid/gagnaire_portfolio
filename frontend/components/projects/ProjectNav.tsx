import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import styles from "./ProjectNav.module.scss";

interface ProjectNavProps {
  prevSlug: string | null;
  nextSlug: string | null;
}

export function ProjectNav({ prevSlug, nextSlug }: ProjectNavProps) {
  return (
    <nav className={styles.wrapper} aria-label="Navigation entre projets">
      <div className={styles.group}>
        <div className={styles.prev}>
          <Button
            href={prevSlug ? `/projects/${prevSlug}` : undefined}
            variant="outline"
            icon={<FaArrowLeft aria-hidden="true" />}
            ariaLabel="Projet précédent"
            disabled={!prevSlug}
          >
            Précédent
          </Button>
        </div>
        <div className={styles.center}>
          <Button
            href="/projects"
            variant="outline"
            ariaLabel="Retour à tous les projets"
          >
            Tous les projets
          </Button>
        </div>
        <div className={styles.next}>
          <Button
            href={nextSlug ? `/projects/${nextSlug}` : undefined}
            variant="outline"
            icon={<FaArrowRight aria-hidden="true" />}
            ariaLabel="Projet suivant"
            disabled={!nextSlug}
          >
            Suivant
          </Button>
        </div>
      </div>
    </nav>
  );
}
