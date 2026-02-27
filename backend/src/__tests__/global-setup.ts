import { execSync } from "child_process";

const TEST_DB_NAME = "portfolio_test_db";
const TEST_DB_URL =
  process.env.DATABASE_URL ||
  `postgresql://portfolio:portfolio_dev@localhost:5432/${TEST_DB_NAME}`;

/**
 * Tente de créer la base de données de test via docker exec (développement local).
 * En CI (GitHub Actions), la DB est déjà créée par le service postgres — cette fonction
 * retourne silencieusement false sans bloquer.
 */
function tryCreateDbViaDocker(): boolean {
  const containerName = "gagnaire_portfolio-postgres-1";
  const pgUser = "portfolio";

  try {
    // Vérifier si le container Docker est disponible et en marche
    const running = execSync(
      `docker inspect ${containerName} --format "{{.State.Running}}"`,
      { stdio: "pipe" },
    )
      .toString()
      .trim();

    if (running !== "true") return false;

    // Créer la DB si elle n'existe pas déjà
    try {
      execSync(
        `docker exec ${containerName} psql -U ${pgUser} postgres -c "CREATE DATABASE ${TEST_DB_NAME}"`,
        { stdio: "pipe" },
      );
      console.log(`[Global Setup] Base de test '${TEST_DB_NAME}' créée.`);
    } catch {
      // 42P04 = duplicate_database — la DB existe déjà, c'est OK
      console.log(`[Global Setup] Base de test '${TEST_DB_NAME}' déjà existante.`);
    }
    return true;
  } catch {
    return false;
  }
}

export async function setup() {
  console.log("\n[Global Setup] Préparation de la base de test...");

  const dockerAvailable = tryCreateDbViaDocker();

  if (!dockerAvailable) {
    // CI (GitHub Actions) : la DB est créée par le service postgres du workflow
    // et les migrations sont appliquées dans l'étape "Apply Prisma migrations"
    console.log(
      "[Global Setup] Docker local non disponible → DB déjà provisionnée par le CI.",
    );
    return;
  }

  // Développement local : appliquer les migrations sur la DB de test
  console.log("[Global Setup] Application des migrations Prisma...");
  try {
    execSync("npx prisma migrate deploy", {
      cwd: process.cwd(),
      env: { ...process.env, DATABASE_URL: TEST_DB_URL },
      stdio: "pipe",
    });
    console.log("[Global Setup] Migrations appliquées.\n");
  } catch (err) {
    console.warn("[Global Setup] Échec des migrations :", String(err));
    console.warn(
      "  → Vérifiez que le PostgreSQL brew est arrêté : brew services stop postgresql@16",
    );
  }
}

export async function teardown() {
  console.log("\n[Global Teardown] Suite de tests terminée.\n");
}
