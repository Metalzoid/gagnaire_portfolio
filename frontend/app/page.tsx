"use client";

import useSnapScroll from "@/hooks/useSnapScroll";
import { ProgressBar } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { homeSections } from "@/data/sections";
import styles from "./page.module.scss";

export default function Home() {
  const { currentSection, totalSections, goToSection, containerRef } =
    useSnapScroll({ totalSections: homeSections.length });

  return (
    <div className="page page--home">
      <ProgressBar
        currentSection={currentSection}
        totalSections={totalSections}
        sectionLabels={homeSections.map((s) => s.label)}
        goToSection={goToSection}
      />

      <div ref={containerRef} className={styles.snapContainer}>
        {homeSections.map((section, index) => {
          const isLast = index === homeSections.length - 1;
          return (
            <section
              key={section.id}
              id={section.id}
              className={`${styles.snapSection} ${
                isLast ? styles["snapSection--withFooter"] : ""
              }`}
              aria-label={section.label}
              data-snap-section
              data-snap-index={index}
            >
              <div className={styles.sectionContent}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <p className={styles.sectionText}>{section.text}</p>
              </div>
              {isLast && <Footer />}
            </section>
          );
        })}
      </div>
    </div>
  );
}
