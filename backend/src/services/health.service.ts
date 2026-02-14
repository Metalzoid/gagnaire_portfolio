/**
 * Service health - logique métier pour le healthcheck.
 * Pour l'instant minimal (timestamp), extensible plus tard (vérif BDD, etc.)
 */
export function getHealthStatus() {
  return {
    status: "OK" as const,
    timestamp: new Date().toISOString(),
  };
}
