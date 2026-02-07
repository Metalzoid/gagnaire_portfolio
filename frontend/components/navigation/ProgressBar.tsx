"use client";

import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  currentSection: number;
  totalSections: number;
  sectionLabels: string[];
  goToSection: (index: number) => void;
}

const ProgressBar = ({
  currentSection,
  totalSections,
  sectionLabels,
  goToSection,
}: ProgressBarProps) => {
  return (
    <nav className={styles.progressBar} aria-label="Navigation des sections">
      <ul className={styles.list}>
        {Array.from({ length: totalSections }, (_, i) => (
          <li key={i} className={styles.item}>
            <button
              className={`${styles.dot} ${
                i === currentSection ? styles["dot--active"] : ""
              }`}
              onClick={() => goToSection(i)}
              aria-label={`Aller à la section ${sectionLabels[i] || i + 1}`}
              aria-current={i === currentSection ? "true" : undefined}
              type="button"
            >
              <span className={styles.indicator} />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ProgressBar;
