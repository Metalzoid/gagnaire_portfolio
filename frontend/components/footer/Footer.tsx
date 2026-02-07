import { SocialLinks } from "@/components/shared/social-links";
import styles from "./Footer.module.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <SocialLinks size="sm" />
        <p className={styles.copyright}>
          &copy; {currentYear} Gagnaire Florian. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
