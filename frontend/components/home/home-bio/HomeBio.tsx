"use client";

import Image from "next/image";
import { getProfile } from "@/services/data";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import styles from "./HomeBio.module.scss";

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function HomeBio() {
  const profile = getProfile();
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${isVisible ? styles["wrapper--visible"] : ""}`}
    >
      <div className={styles.content}>
        <div className={styles.photoWrapper}>
          <div className={styles.photoFrame}>
            <Image
              src={profile.photo}
              alt={`${profile.firstName} ${profile.lastName}`}
              width={200}
              height={200}
              className={styles.photo}
              priority
            />
          </div>
        </div>
        <div className={styles.text}>
          <h2 className={styles.title}>À propos</h2>
          <p className={styles.bio}>{profile.bio}</p>
          <div className={styles.cta}>
            <Button href="/about" variant="outline" ariaLabel="En savoir plus">
              En savoir plus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
