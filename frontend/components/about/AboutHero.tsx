import type { Profile } from "shared";
import {
  ImageWithFallback,
  PLACEHOLDER_AVATAR,
} from "@/components/ui/image-with-fallback";
import { getBackendImageUrl } from "@/services/api";
import styles from "./AboutHero.module.scss";

export function AboutHero({ profile }: { profile: Profile }) {
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const photoSrc = profile.photo?.startsWith("/uploads/")
    ? getBackendImageUrl(profile.photo)
    : profile.photo || PLACEHOLDER_AVATAR;

  return (
    <div className={styles.wrapper}>
      <div className={styles.photoWrapper}>
        <ImageWithFallback
          src={photoSrc}
          fallbackSrc={PLACEHOLDER_AVATAR}
          alt={fullName}
          width={180}
          height={180}
          className={styles.photo}
          priority
          sizes="(max-width: 480px) 120px, (max-width: 1024px) 140px, 180px"
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
