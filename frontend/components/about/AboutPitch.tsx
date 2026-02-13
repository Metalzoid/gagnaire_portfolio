"use client";

import { getProfile, getPitchBlocks } from "@/services/data";
import { Carousel } from "@/components/ui/carousel";
import { PITCH_ICONS } from "./about-icons";
import type { PitchBlock } from "@/types";
import styles from "./AboutPitch.module.scss";

const renderPitchBlock = (profile: ReturnType<typeof getProfile>) => (block: PitchBlock) => {
  const Icon = PITCH_ICONS[block.icon];
  if (!Icon) return null;
  return (
    <div className={styles.block}>
      <div className={styles.iconWrapper}>
        <Icon className={styles.icon} aria-hidden="true" />
      </div>
      <h3 className={styles.blockTitle}>{block.title}</h3>
      <p className={styles.blockText}>{profile.pitch[block.key]}</p>
    </div>
  );
};

export function AboutPitch() {
  const profile = getProfile();
  const pitchBlocks = getPitchBlocks();
  const renderBlock = renderPitchBlock(profile);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.sectionTitle}>Mon pitch</h2>

      {/* Grille desktop / tablette */}
      <div className={styles.grid}>
        {pitchBlocks.map((block) => {
          const Icon = PITCH_ICONS[block.icon];
          if (!Icon) return null;
          return (
            <div key={block.key} className={styles.block}>
              <div className={styles.iconWrapper}>
                <Icon className={styles.icon} aria-hidden="true" />
              </div>
              <h3 className={styles.blockTitle}>{block.title}</h3>
              <p className={styles.blockText}>{profile.pitch[block.key]}</p>
            </div>
          );
        })}
      </div>

      {/* Carousel mobile */}
      <div className={styles.mobileCarousel}>
        <Carousel
          items={pitchBlocks}
          renderItem={(block) => renderBlock(block)}
          showDots={true}
          showArrows={true}
          loop={true}
          ariaLabel="Mon pitch"
        />
      </div>
    </div>
  );
}
