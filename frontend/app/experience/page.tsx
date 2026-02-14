import { Timeline } from "@/components/experience";
import { BreadcrumbSchema } from "@/components/seo";
import { Container } from "@/components/ui/container";
import styles from "./experience.module.scss";

export const metadata = {
  title: "Parcours",
  description:
    "Formation et expériences professionnelles en développement web.",
};

export default function ExperiencePage() {
  return (
    <div className={`page page--experience ${styles.page}`}>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", href: "/" },
          { name: "Parcours", href: "/experience" },
        ]}
      />
      <Container>
        <header className={styles.header}>
          <h1 className={styles.title}>Mon parcours</h1>
          <p className={styles.intro}>
            Formation et expériences professionnelles.
          </p>
        </header>
        <Timeline />
      </Container>
    </div>
  );
}
