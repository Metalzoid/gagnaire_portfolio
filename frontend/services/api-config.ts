// ==========================================================================
// Configuration API centralisée
// Source unique pour les URLs et préfixes API (SSR + navigateur)
// ==========================================================================

/**
 * URL de base côté serveur (SSR).
 * En Docker : API_URL_INTERNAL (réseau interne, ex: http://backend:3001).
 * En local  : fallback http://localhost:3001.
 */
export const API_BASE_SERVER =
  process.env.API_URL_INTERNAL ?? "http://localhost:3001";

/**
 * URL de base côté client (navigateur).
 * En Docker prod : "" (vide → URLs relatives, proxy Next.js via /api/:path*).
 * En Docker dev  : http://localhost:3001 (ports exposés, accès direct).
 * En local       : http://localhost:3001 (fallback).
 *
 * Note : on utilise ?? (nullish) et non || pour préserver la chaîne vide.
 */
export const API_BASE_CLIENT =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Préfixe API — unifié pour toute l'application */
export const API_PREFIX = "/api/v1";
