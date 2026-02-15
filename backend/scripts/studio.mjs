#!/usr/bin/env node
/**
 * Lance Prisma Studio avec une URL postgresql:// standard.
 * Contourne le bug Prisma 7 "prisma+postgres protocol with localhost is not supported".
 *
 * Utilise STUDIO_DATABASE_URL si défini, sinon une URL postgresql:// standard.
 * Si DATABASE_URL contient api_key (Prisma Postgres) ou prisma+postgres, on utilise
 * l'URL locale par défaut (PostgreSQL Docker).
 */
import { config } from "dotenv";
import { execSync } from "child_process";
import { resolve } from "path";

// Charger .env depuis la racine du monorepo ou backend
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../.env") });

const defaultUrl =
  "postgresql://portfolio:portfolio_dev@localhost:5432/portfolio_db";

let url = process.env.STUDIO_DATABASE_URL || process.env.DATABASE_URL || defaultUrl;

// Prisma Studio ne supporte pas prisma+postgres ni les URLs avec api_key (Prisma Postgres)
// → utiliser l'URL PostgreSQL locale
if (url.includes("api_key") || url.startsWith("prisma+postgres")) {
  url = defaultUrl;
} else if (url.includes("@postgres:")) {
  // Depuis l'hôte, remplacer le hostname Docker par localhost
  url = url.replace("@postgres:", "@localhost:");
}

execSync(`npx prisma studio --url "${url}"`, {
  stdio: "inherit",
});
