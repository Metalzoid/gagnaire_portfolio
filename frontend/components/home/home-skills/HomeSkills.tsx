"use client";

import { useMemo } from "react";
import {
  FaReact,
  FaNode,
  FaGitAlt,
  FaHtml5,
  FaSass,
  FaDocker,
  FaCode,
  FaFigma,
  FaServer,
} from "react-icons/fa";
import {
  SiTypescript,
  SiPostgresql,
  SiNextdotjs,
  SiExpress,
} from "react-icons/si";
import { getSkills } from "@/services/data";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import styles from "./HomeSkills.module.scss";

// --------------------------------------------------------------------------
// Mapping icônes React Icons
// --------------------------------------------------------------------------
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaReact,
  SiTypescript,
  FaHtml5,
  SiNextdotjs,
  FaSass,
  FaNode,
  SiExpress,
  SiPostgresql,
  FaServer,
  FaGitAlt,
  FaDocker,
  FaCode,
  FaFigma,
};

type SkillItem = { name: string; icon: string };

// --------------------------------------------------------------------------
// Rendu d'un item compétence
// --------------------------------------------------------------------------
const renderSkillItem = (skill: SkillItem) => {
  const IconComponent = iconMap[skill.icon];
  return (
    <div key={skill.name} className={styles.iconItem} title={skill.name}>
      {IconComponent && (
        <IconComponent className={styles.icon} aria-hidden="true" />
      )}
      <span className={styles.iconLabel}>{skill.name}</span>
    </div>
  );
};

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function HomeSkills() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });
  const skillsData = getSkills();

  const mainSkills = useMemo(() => {
    const skills: SkillItem[] = [];
    for (const cat of skillsData) {
      for (const s of cat.skills) {
        if (s.icon && iconMap[s.icon]) {
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
