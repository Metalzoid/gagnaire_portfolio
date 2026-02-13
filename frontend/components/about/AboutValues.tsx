"use client";

import { FaCode, FaUniversalAccess, FaBolt, FaLightbulb } from "react-icons/fa";
import { getProfile } from "@/services/data";
import { useContactModal } from "@/contexts/ContactModalContext";
import { Button } from "@/components/ui/button";
import styles from "./AboutValues.module.scss";

const values = [
  {
    icon: FaCode,
    title: "Clean code",
    description: "Code lisible, maintenable et bien structuré.",
  },
  {
    icon: FaUniversalAccess,
    title: "Accessibilité",
    description: "Des interfaces utilisables par tous.",
  },
  {
    icon: FaBolt,
    title: "Performance",
    description: "Applications rapides et optimisées.",
  },
  {
    icon: FaLightbulb,
    title: "Curiosité",
    description: "Veille continue et apprentissage permanent.",
  },
];

export function AboutValues() {
  const { openContactModal } = useContactModal();

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.sectionTitle}>Mes valeurs</h2>
      <div className={styles.grid}>
        {values.map(({ icon: Icon, title, description }) => (
          <div key={title} className={styles.block}>
            <Icon className={styles.icon} aria-hidden="true" />
            <h3 className={styles.blockTitle}>{title}</h3>
            <p className={styles.blockText}>{description}</p>
          </div>
        ))}
      </div>
      <div className={styles.ctas}>
        <Button
          href={getProfile().cv}
          variant="primary"
          ariaLabel="Télécharger mon CV"
        >
          Télécharger mon CV
        </Button>
        <Button variant="outline" ariaLabel="Me contacter" onClick={openContactModal}>
          Me contacter
        </Button>
      </div>
    </div>
  );
}
