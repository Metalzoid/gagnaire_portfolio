import { ContactForm, ContactInfo } from "@/components/contact";
import { BreadcrumbSchema } from "@/components/seo";
import { Container } from "@/components/ui/container";
import styles from "./contact.module.scss";

export const metadata = {
  title: "Contact",
  description:
    "Formulaire de contact pour vos projets de développement web.",
};

export default function ContactPage() {
  return (
    <div className={`page page--contact ${styles.page}`}>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />
      <Container>
        <header className={styles.header}>
          <h1 className={styles.title}>Contact</h1>
          <p className={styles.intro}>
            Une question, un projet ? N&apos;hésitez pas à me contacter.
          </p>
        </header>

        <div className={styles.content}>
          <div className={styles.formSection}>
            <ContactForm />
          </div>
          <div className={styles.infoSection}>
            <ContactInfo />
          </div>
        </div>
      </Container>
    </div>
  );
}
