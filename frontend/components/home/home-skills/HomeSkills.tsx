"use client";

import { useMemo } from "react";
import type { SkillCategory } from "shared";
import { TechIcon, canRenderTechIcon } from "@/utils/technologyIcon";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import styles from "./HomeSkills.module.scss";

type SkillItem = { name: string; icon: string };

// --------------------------------------------------------------------------
// Rendu d'un item compétence
// --------------------------------------------------------------------------
const renderSkillItem = (skill: SkillItem) => (
  <div key={skill.name} className={styles.iconItem} title={skill.name}>
    <TechIcon icon={skill.icon} name={skill.name} className={styles.icon} />
    <span className={styles.iconLabel}>{skill.name}</span>
  </div>
);

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function HomeSkills({
  skills: skillsData,
}: {
  skills: SkillCategory[];
}) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  const mainSkills = useMemo(() => {
    const skills: SkillItem[] = [];
    for (const cat of skillsData) {
      for (const s of cat.skills) {
        if (s.icon && canRenderTechIcon(s.icon)) {
          skills.push({ name: s.name, icon: s.icon });
          if (skills.length >= 12) break;
        }
      }
      if (skills.length >= 12) break;
    }
    return skills;
  }, [skillsData]);

  // Groupes de 4 pour le carousel mobile
  const skillChunks = useMemo(() => {
    const chunks: SkillItem[][] = [];
    for (let i = 0; i < mainSkills.length; i += 4) {
      chunks.push(mainSkills.slice(i, i + 4));
    }
    return chunks;
  }, [mainSkills]);

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${isVisible ? styles["wrapper--visible"] : ""}`}
    >
      <h2 className={styles.title}>Compétences</h2>
      <p className={styles.intro}>
        Technologies et outils que j&apos;utilise au quotidien.
      </p>

      {/* Grille desktop / tablette */}
      <div className={styles.iconGrid}>
        {mainSkills.map((skill) => renderSkillItem(skill))}
      </div>

      {/* Carousel mobile : 4 items par slide */}
      <div className={styles.mobileCarousel}>
        <Carousel
          items={skillChunks}
          renderItem={(chunk) => (
            <div className={styles.slideGrid}>
              {chunk.map((skill) => renderSkillItem(skill))}
            </div>
          )}
          showDots={true}
          showArrows={true}
          autoPlay={true}
          autoPlayInterval={8000}
          loop={true}
          ariaLabel="Compétences"
        />
      </div>

      <div className={styles.cta}>
        <Button
          href="/skills"
          variant="outline"
          ariaLabel="Toutes mes compétences"
        >
          Toutes mes compétences
        </Button>
      </div>
    </div>
  );
}
