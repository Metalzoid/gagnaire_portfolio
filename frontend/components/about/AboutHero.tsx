import Image from "next/image";
import { getProfile } from "@/services/data";
import styles from "./AboutHero.module.scss";

export function AboutHero() {
  const profile = getProfile();
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.photoWrapper}>
        <Image
          src={profile.photo}
          alt={fullName}
          width={280}
          height={280}
          className={styles.photo}
          priority
        />
      </div>
      <div className={styles.content}>
        <h1 className={styles.name}>{fullName}</h1>
        <p className={styles.role}>{profile.role}</p>
        <p className={styles.intro}>{profile.bio}</p>
      </div>
    </div>
  );
}
