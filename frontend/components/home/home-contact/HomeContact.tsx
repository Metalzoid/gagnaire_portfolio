"use client";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { getProfile } from "@/services/data";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useContactModal } from "@/contexts/ContactModalContext";
import { Button } from "@/components/ui/button";
import { SocialLinks } from "@/components/shared/social-links";
import styles from "./HomeContact.module.scss";

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
export function HomeContact() {
  const profile = getProfile();
  const { openContactModal } = useContactModal();
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  const socialLinks = [
    { url: profile.social.github, icon: <FaGithub />, label: "Profil GitHub" },
    {
      url: profile.social.linkedin,
      icon: <FaLinkedin />,
      label: "Profil LinkedIn",
    },
  ];

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
