"use client";

import { useState, useMemo } from "react";
import { getSkills } from "@/services/data";
import { SkillRadar, SkillCategory } from "@/components/skills";
import { Container } from "@/components/ui/container";
import { Tag } from "@/components/ui/tag";
import styles from "./skills.module.scss";

type ViewMode = "radar" | "lines";

export default function SkillsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("radar");
  const skills = useMemo(() => getSkills(), []);

  return (
    <div className={`page page--skills ${styles.page}`}>
      <Container>
        <header className={styles.header}>
          <h1 className={styles.title}>Mes compétences</h1>
          <p className={styles.intro}>
            Technologies, outils et soft skills que j&apos;utilise et développe
            au quotidien.
          </p>
          <div className={styles.viewToggle}>
            <Tag
              label="Toiles"
              active={viewMode === "radar"}
              onClick={() => setViewMode("radar")}
            />
            <Tag
              label="Lignes"
              active={viewMode === "lines"}
              onClick={() => setViewMode("lines")}
            />
          </div>
        </header>

        {viewMode === "radar" && (
          <div className={styles.radars}>
            {skills.map((category, index) => (
              <SkillRadar key={category.name} category={category} index={index} />
            ))}
          </div>
        )}

        {viewMode === "lines" && (
          <div className={styles.categories}>
            {skills.map((category) => (
              <SkillCategory key={category.name} category={category} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
