"use client";

import { getProfile, getValues } from "@/services/data";
import { useContactModal } from "@/contexts/ContactModalContext";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { VALUES_ICONS } from "./about-icons";
import type { AboutValue } from "@/types";
import styles from "./AboutValues.module.scss";

export function AboutValues() {
  const { openContactModal } = useContactModal();
  const values = getValues();

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.sectionTitle}>Mes valeurs</h2>

      {/* Grille desktop / tablette */}
      <div className={styles.grid}>
        {values.map((value) => {
          const Icon = VALUES_ICONS[value.icon];
          if (!Icon) return null;
          return (
            <div key={value.title} className={styles.block}>
              <Icon className={styles.icon} aria-hidden="true" />
              <h3 className={styles.blockTitle}>{value.title}</h3>
              <p className={styles.blockText}>{value.description}</p>
            </div>
          );
        })}
      </div>

      {/* Carousel mobile */}
      <div className={styles.mobileCarousel}>
        <Carousel<AboutValue>
          items={values}
          renderItem={(value) => {
            const Icon = VALUES_ICONS[value.icon];
            if (!Icon) return null;
            return (
              <div className={styles.block}>
                <Icon className={styles.icon} aria-hidden="true" />
                <h3 className={styles.blockTitle}>{value.title}</h3>
                <p className={styles.blockText}>{value.description}</p>
              </div>
            );
          }}
          showDots={true}
          showArrows={true}
          loop={true}
          ariaLabel="Mes valeurs"
        />
      </div>

      <div className={styles.ctas}>
        <Button
          href={getProfile().cv}
          variant="primary"
          ariaLabel="Télécharger mon CV"
        >
          Télécharger mon CV
        </Button>
        <Button
          variant="outline"
          ariaLabel="Me contacter"
          onClick={openContactModal}
        >
          Me contacter
        </Button>
      </div>
    </div>
  );
}
