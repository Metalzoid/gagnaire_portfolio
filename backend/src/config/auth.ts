/**
 * Configuration JWT pour l'authentification.
 */
export const authConfig = {
  /** Durée de vie du access token (15 minutes) */
  accessTokenExpiresIn: "1m",
  /** Durée de vie du refresh token (7 jours) */
  refreshTokenExpiresIn: "7d",
} as const;
