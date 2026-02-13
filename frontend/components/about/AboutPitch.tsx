import { FaUser, FaCode, FaHeart, FaCogs } from "react-icons/fa";
import { getProfile } from "@/services/data";
import styles from "./AboutPitch.module.scss";

const pitchBlocks = [
  { key: "who" as const, icon: FaUser, title: "Qui suis-je" },
  { key: "what" as const, icon: FaCode, title: "Ce que je fais" },
  { key: "why" as const, icon: FaHeart, title: "Pourquoi" },
  { key: "method" as const, icon: FaCogs, title: "Ma méthode" },
];

export function AboutPitch() {
  const profile = getProfile();

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.sectionTitle}>Mon pitch</h2>
      <div className={styles.grid}>
        {pitchBlocks.map(({ key, icon: Icon, title }) => (
          <div key={key} className={styles.block}>
            <div className={styles.iconWrapper}>
              <Icon className={styles.icon} aria-hidden="true" />
            </div>
            <h3 className={styles.blockTitle}>{title}</h3>
            <p className={styles.blockText}>{profile.pitch[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
