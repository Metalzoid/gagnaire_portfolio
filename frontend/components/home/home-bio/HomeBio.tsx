"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { Profile } from "shared";
import { Button } from "@/components/ui/button";
import {
  ImageWithFallback,
  PLACEHOLDER_AVATAR,
} from "@/components/ui/image-with-fallback";
import { getBackendImageUrl } from "@/services/api";
import styles from "./HomeBio.module.scss";

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function HomeBio({ profile }: { profile: Profile }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });
  const photoSrc = profile.photo?.startsWith("/uploads/")
    ? getBackendImageUrl(profile.photo)
    : profile.photo || PLACEHOLDER_AVATAR;

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${isVisible ? styles["wrapper--visible"] : ""}`}
    >
      <div className={styles.content}>
        <div className={styles.photoWrapper}>
          <div className={styles.photoFrame}>
            <ImageWithFallback
              src={photoSrc}
              fallbackSrc={PLACEHOLDER_AVATAR}
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
