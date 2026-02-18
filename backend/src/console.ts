import repl from "node:repl";
import { resolve } from "path";
import { inspect } from "node:util";
import { config } from "dotenv";
import chalk from "chalk";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Charger .env (racine monorepo ou backend)
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../.env") });

const defaultUrl =
  "postgresql://portfolio:portfolio_dev@localhost:5432/portfolio_db";
let url = process.env.DATABASE_URL || defaultUrl;
if (url.includes("api_key") || url.startsWith("prisma+postgres")) {
  url = defaultUrl;
}

const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$connect();
  console.log(chalk.green("✓ Console Portfolio - Prisma connecté"));
  console.log(
    chalk.cyan("Modèles disponibles :") +
      " db.admin, db.refreshToken, db.profile, db.project, db.projectImage, db.technology, db.skillCategory, db.skill, db.experience, db.testimonial",
  );
  console.log(chalk.dim("Tapez .help pour l'aide, .exit pour quitter\n"));

  const r = repl.start({
    prompt: chalk.magenta("portfolio") + chalk.dim("> ") + chalk.reset(),
    useGlobal: true,
    writer: (output: unknown) =>
      inspect(output, {
        colors: true,
        depth: null,
        compact: false,
        breakLength: 80,
        maxArrayLength: 100,
      }),
  });

  r.context.prisma = prisma;
  r.context.chalk = chalk;
  r.context.db = {
    admin: prisma.admin,
    refreshToken: prisma.refreshToken,
    profile: prisma.profile,
    project: prisma.project,
    projectImage: prisma.projectImage,
    technology: prisma.technology,
    skillCategory: prisma.skillCategory,
    skill: prisma.skill,
    experience: prisma.experience,
    testimonial: prisma.testimonial,
  };

  r.context.findAll = (model: string) =>
    (prisma as unknown as Record<string, { findMany: () => Promise<unknown> }>)[
      model
    ]?.findMany();
  r.context.count = (model: string) =>
    (prisma as unknown as Record<string, { count: () => Promise<number> }>)[
      model
    ]?.count();
  r.context.truncate = async (model: string) => {
    const result = await (
      prisma as unknown as Record<
        string,
        { deleteMany: () => Promise<{ count: number }> }
      >
    )[model]?.deleteMany();
    return `${result?.count ?? 0} enregistrements supprimés`;
  };

  r.on("exit", async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
