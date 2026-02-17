"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { Testimonial } from "shared";
import { Carousel } from "@/components/ui/carousel";
import {
  ImageWithFallback,
  PLACEHOLDER_AVATAR,
} from "@/components/ui/image-with-fallback";
import { getBackendImageUrl } from "@/services/api";
import styles from "./HomeTestimonials.module.scss";

// --------------------------------------------------------------------------
// Rendu d'une carte témoignage (partagé entre liste et carousel)
// --------------------------------------------------------------------------
const renderTestimonialCard = (t: Testimonial) => {
  const photoSrc = t.photo
    ? t.photo.startsWith("/uploads/")
      ? getBackendImageUrl(t.photo)
      : t.photo
    : PLACEHOLDER_AVATAR;
  return (
    <blockquote key={t.name} className={styles.card}>
      <span className={styles.quoteMark} aria-hidden="true">
        &ldquo;
      </span>
      <p className={styles.quote}>{t.quote}</p>
      <footer className={styles.footer}>
        <div className={styles.avatar}>
          <ImageWithFallback
            src={photoSrc}
            fallbackSrc={PLACEHOLDER_AVATAR}
            alt=""
            width={48}
            height={48}
            className={styles.avatarImg}
          />
        </div>
        <div>
          <cite className={styles.name}>{t.name}</cite>
          <span className={styles.role}>
            {t.role} — {t.company}
          </span>
        </div>
      </footer>
    </blockquote>
  );
};

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function HomeTestimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${isVisible ? styles["wrapper--visible"] : ""}`}
    >
      <h2 className={styles.title}>Témoignages</h2>
      <p className={styles.intro}>Ce qu&apos;ils disent de mon travail.</p>

      {/* Liste desktop / tablette */}
      <div className={styles.cards}>
        {testimonials.map((t) => renderTestimonialCard(t))}
      </div>

      {/* Carousel mobile uniquement */}
      <div className={styles.mobileCarousel}>
        <Carousel
          items={testimonials}
          renderItem={(t) => renderTestimonialCard(t)}
          showDots={true}
          showArrows={true}
          autoPlay={true}
          autoPlayInterval={10000}
          loop={true}
          ariaLabel="Témoignages"
        />
      </div>
    </div>
  );
}
