import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import styles from "./SocialLinks.module.scss";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------
interface SocialLink {
  url: string;
  icon: React.ReactNode;
  label: string;
}

interface SocialLinksProps {
  links?: SocialLink[];
  size?: "sm" | "md" | "lg";
  direction?: "row" | "column";
}

// --------------------------------------------------------------------------
// Liens par défaut
// --------------------------------------------------------------------------
const defaultLinks: SocialLink[] = [
  {
    url: "https://github.com/Metalzoid",
    icon: <FaGithub />,
    label: "Profil GitHub",
  },
  {
    url: "https://www.linkedin.com/in/florian-gagnaire/",
    icon: <FaLinkedin />,
    label: "Profil LinkedIn",
  },
  {
    url: "mailto:contact@gagnaire.dev",
    icon: <MdEmail />,
    label: "Envoyer un email",
  },
];

// --------------------------------------------------------------------------
// Composant
// --------------------------------------------------------------------------
const SocialLinks = ({
  links = defaultLinks,
  size = "md",
  direction = "row",
}: SocialLinksProps) => {
  return (
    <ul
      className={`${styles.list} ${styles[`list--${direction}`]} ${styles[`list--${size}`]}`}
      aria-label="Liens sociaux"
    >
      {links.map((link) => (
        <li key={link.label} className={styles.item}>
          <a
            href={link.url}
            className={styles.link}
            aria-label={link.label}
            title={link.label}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.icon} aria-hidden="true">
              {link.icon}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default SocialLinks;
