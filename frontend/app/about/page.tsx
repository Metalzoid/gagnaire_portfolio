import { AboutHero, AboutPitch, AboutValues } from "@/components/about";
import { Container } from "@/components/ui/container";
import styles from "./about.module.scss";

export const metadata = {
  title: "À propos - Gagnaire Florian",
  description:
    "Découvrez mon parcours, ma méthode et mes valeurs en tant que développeur fullstack.",
};

export default function AboutPage() {
  return (
    <div className={`page page--about ${styles.page}`}>
      <Container>
        <AboutHero />
        <AboutPitch />
        <AboutValues />
      </Container>
    </div>
  );
}
