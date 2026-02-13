"use client";

import { getTopProjects } from "@/services/data";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { PLACEHOLDER_PROJECT_IMAGE } from "@/components/ui/image-with-fallback";
import type { Project } from "@/types";
import styles from "./HomeFeaturedProjects.module.scss";

// --------------------------------------------------------------------------
// Rendu d'une carte projet (partagé entre grille et carousel)
// --------------------------------------------------------------------------
const renderProjectCard = (project: Project) => (
  <Card
    image={project.images?.main ?? PLACEHOLDER_PROJECT_IMAGE}
    title={project.title}
    description={project.description}
    tags={project.technologies?.slice(0, 3)}
    href={`/projects/${project.slug}`}
    hoverable
  />
);

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function HomeFeaturedProjects() {
  const projects = getTopProjects();
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${isVisible ? styles["wrapper--visible"] : ""}`}
    >
      <h2 className={styles.title}>Projets à la une</h2>
      <p className={styles.intro}>
        Une sélection de mes réalisations les plus récentes.
      </p>

      {/* Grille desktop / tablette */}
      <div className={styles.grid}>
        {projects.map((project) => (
          <div key={project.slug} className={styles.gridItem}>
            {renderProjectCard(project)}
          </div>
        ))}
      </div>

      {/* Carousel mobile uniquement */}
      <div className={styles.mobileCarousel}>
        <Carousel
          items={projects}
          renderItem={(project) => renderProjectCard(project)}
          showDots={true}
          showArrows={true}
          showCounter={false}
          autoPlay={true}
          autoPlayInterval={5000}
          loop={true}
          ariaLabel="Projets à la une"
        />
      </div>

      <div className={styles.cta}>
        <Button href="/projects" variant="outline" ariaLabel="Tous les projets">
          Tous les projets
        </Button>
      </div>
    </div>
  );
}
