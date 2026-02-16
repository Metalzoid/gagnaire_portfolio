"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import styles from "./error.module.scss";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isApiError = error.message?.includes("API") || error.message?.includes("fetch");

  return (
    <div className={`page page--error ${styles.page}`}>
      <Container>
        <div className={styles.content}>
          <h1 className={styles.title}>Une erreur est survenue</h1>
          <p className={styles.message}>
            {isApiError
              ? "Le serveur ne répond pas pour le moment. Veuillez réessayer dans quelques instants."
              : "Désolé, une erreur inattendue s'est produite."}
          </p>
          <div className={styles.actions}>
            <Button
              variant="primary"
              ariaLabel="Réessayer"
              onClick={reset}
            >
              Réessayer
            </Button>
            <Button href="/" variant="outline" ariaLabel="Retour à l'accueil">
              Retour à l&apos;accueil
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
