"use client";

import Image from "next/image";
import { getTestimonials } from "@/services/data";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Carousel } from "@/components/ui/carousel";
import type { Testimonial } from "@/types";
import styles from "./HomeTestimonials.module.scss";

// --------------------------------------------------------------------------
// Placeholder pour photo témoignage
// --------------------------------------------------------------------------
const PLACEHOLDER_AVATAR = "/images/profile/photo.svg";

// --------------------------------------------------------------------------
// Rendu d'une carte témoignage (partagé entre liste et carousel)
// --------------------------------------------------------------------------
const renderTestimonialCard = (t: Testimonial) => (
  <blockquote key={t.name} className={styles.card}>
    <span className={styles.quoteMark} aria-hidden="true">
      &ldquo;
    </span>
    <p className={styles.quote}>{t.quote}</p>
    <footer className={styles.footer}>
      <div className={styles.avatar}>
        <Image
          src={t.photo || PLACEHOLDER_AVATAR}
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

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function HomeTestimonials() {
  const testimonials = getTestimonials();
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
