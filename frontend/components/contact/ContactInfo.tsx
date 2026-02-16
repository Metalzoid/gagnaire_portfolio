import { SocialLinks } from "@/components/shared/social-links";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import type { Profile } from "shared";
import styles from "./ContactInfo.module.scss";

export function ContactInfo({ profile }: { profile: Profile }) {
  const links = [
    { url: profile.social.github, icon: <FaGithub />, label: "GitHub" },
    { url: profile.social.linkedin, icon: <FaLinkedin />, label: "LinkedIn" },
    {
      url: `mailto:${profile.social.email}`,
      icon: <MdEmail />,
      label: "Email",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Me contacter</h3>
      <p className={styles.intro}>
        Envie de discuter d&apos;un projet ou d&apos;une opportunité ?
      </p>
      <a href={`mailto:${profile.social.email}`} className={styles.email}>
        {profile.social.email}
      </a>
      <SocialLinks links={links} size="lg" direction="column" />
    </div>
  );
}
