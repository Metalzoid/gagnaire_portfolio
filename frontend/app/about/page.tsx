import { AboutHero, AboutPitch, AboutValues } from "@/components/about";
import { BreadcrumbSchema, ProfilePageSchema } from "@/components/seo";
import { Container } from "@/components/ui/container";
import { getProfile } from "@/services/api";
import { pitchBlocks, aboutValues } from "@/data/about.config";
import styles from "./about.module.scss";

export const metadata = {
  title: "À propos",
  description:
    "Qui je suis, mon parcours et mes valeurs en tant que développeur fullstack.",
};

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <div className={`page page--about ${styles.page}`}>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", href: "/" },
          { name: "À propos", href: "/about" },
        ]}
      />
      <ProfilePageSchema profile={profile} />
      <Container>
        <AboutHero profile={profile} />
        <AboutPitch profile={profile} pitchBlocks={pitchBlocks} />
        <AboutValues profile={profile} values={aboutValues} />
      </Container>
    </div>
  );
}
