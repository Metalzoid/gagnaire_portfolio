import { Container } from "@/components/ui/container";
import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <div className={`page page--loading ${styles.page}`}>
      <Container>
        <div className={styles.content} aria-live="polite" aria-busy="true">
          <div className={styles.spinner} aria-hidden="true" />
          <p className={styles.text}>Chargement en cours...</p>
        </div>
      </Container>
    </div>
  );
}
