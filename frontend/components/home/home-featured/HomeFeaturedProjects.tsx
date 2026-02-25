"use client";

import { useMemo } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { Project } from "shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { PLACEHOLDER_PROJECT_IMAGE } from "@/components/ui/image-with-fallback";
import { getBackendImageUrl } from "@/services/api";
import styles from "./HomeFeaturedProjects.module.scss";

// --------------------------------------------------------------------------
// Rendu d'une carte projet (partagé entre grille et carousel)
// --------------------------------------------------------------------------
const renderProjectCard = (project: Project) => (
  <Card
    image={
      (project.images?.[0]?.path &&
        getBackendImageUrl(project.images[0].path)) ??
      PLACEHOLDER_PROJECT_IMAGE
    }
    title={project.title}
    description={project.description}
    tags={project.technologies?.slice(0, 3).map((t) => t.name)}
    href={`/projects/${project.slug}`}
    hoverable
  />
);

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function HomeFeaturedProjects({ projects }: { projects: Project[] }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  // Groupes de 3 pour le carousel paysage
  const projectChunks = useMemo(() => {
    const chunks: Project[][] = [];
    for (let i = 0; i < projects.length; i += 3) {
      chunks.push(projects.slice(i, i + 3));
    }
    return chunks;
  }, [projects]);

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

      {/* Carousel mobile portrait (1 projet par slide) */}
      <div className={styles.mobileCarousel}>
        <Carousel
          items={projects}
          renderItem={(project) => renderProjectCard(project)}
          showDots={true}
          showArrows={true}
          showCounter={false}
          autoPlay={true}
          autoPlayInterval={10000}
          loop={true}
          ariaLabel="Projets à la une"
        />
      </div>

      {/* Carousel paysage (3 projets par slide) */}
      <div className={styles.landscapeCarousel}>
        <Carousel
          items={projectChunks}
          renderItem={(chunk) => (
            <div className={styles.slideGrid}>
              {chunk.map((project) => (
                <div key={project.slug} className={styles.slideGridItem}>
                  {renderProjectCard(project)}
                </div>
              ))}
            </div>
          )}
          showDots={true}
          showArrows={true}
          autoPlay={true}
          autoPlayInterval={10000}
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
