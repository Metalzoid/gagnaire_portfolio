"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useContactModal } from "@/contexts/ContactModalContext";
import { Button } from "@/components/ui/button";
import styles from "./HomeContact.module.scss";

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function HomeContact() {
  const { openContactModal } = useContactModal();
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${isVisible ? styles["wrapper--visible"] : ""}`}
    >
      <h2 className={styles.title}>Un projet en tête ?</h2>
      <p className={styles.subtitle}>
        Travaillons ensemble. N&apos;hésitez pas à me contacter.
      </p>
      <div className={styles.cta}>
        <Button
          variant="primary"
          size="lg"
          ariaLabel="Me contacter"
          onClick={openContactModal}
        >
          Me contacter
        </Button>
      </div>
    </div>
  );
}
