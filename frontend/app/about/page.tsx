import { AboutHero, AboutPitch, AboutValues } from "@/components/about";
import { BreadcrumbSchema, ProfilePageSchema } from "@/components/seo";
import { Container } from "@/components/ui/container";
import styles from "./about.module.scss";

export const metadata = {
  title: "À propos",
  description:
    "Qui je suis, mon parcours et mes valeurs en tant que développeur fullstack.",
};

export default function AboutPage() {
  return (
    <div className={`page page--about ${styles.page}`}>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", href: "/" },
          { name: "À propos", href: "/about" },
        ]}
      />
      <ProfilePageSchema />
      <Container>
        <AboutHero />
        <AboutPitch />
        <AboutValues />
      </Container>
    </div>
  );
}
