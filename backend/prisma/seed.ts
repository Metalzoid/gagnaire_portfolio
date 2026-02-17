import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const url =
  process.env.DATABASE_URL ||
  "postgresql://portfolio:portfolio_dev@localhost:5432/portfolio_db";
const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

async function main() {
  // --- Admin ---
  const email = process.env.ADMIN_EMAIL ?? "admin@portfolio.dev";
  const password = process.env.ADMIN_PASSWORD ?? "changeme";
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { password: hashedPassword },
    create: { email, password: hashedPassword },
  });
  console.log(`✅ Admin seedé : ${admin.email}`);

  // --- Profile ---
  let profile = await prisma.profile.findFirst();
  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        firstName: "Florian",
        lastName: "Gagnaire",
        role: "Développeur Web Fullstack",
        status: "En alternance chez mashe.",
        bio: "Passionné par le développement web, je construis des applications modernes avec React, Node.js et TypeScript.",
        photo: "/images/profile/photo.svg",
        cv: "/cv.pdf",
        pitch: {
          who: "Développeur web en formation",
          what: "Applications fullstack performantes",
          why: "Transformer des idées en solutions numériques",
          method: "Agile, tests, code propre",
        },
        social: {
          github: "https://github.com/Metalzoid",
          linkedin: "https://linkedin.com/in/florian-gagnaire",
          email: "contact@florian-gagnaire.dev",
        },
      },
    });
    console.log(`✅ Profile seedé : ${profile.firstName} ${profile.lastName}`);
  }

  // --- Skills ---
  const catFrontend = await prisma.skillCategory.upsert({
    where: { name: "Frontend" },
    update: {},
    create: { name: "Frontend", order: 0 },
  });
  const catBackend = await prisma.skillCategory.upsert({
    where: { name: "Backend" },
    update: {},
    create: { name: "Backend", order: 1 },
  });
  const catTools = await prisma.skillCategory.upsert({
    where: { name: "Outils" },
    update: {},
    create: { name: "Outils", order: 2 },
  });

  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    await prisma.skill.createMany({
      data: [
        {
          name: "React",
          level: 85,
          categoryId: catFrontend.id,
          order: 0,
          icon: "FaReact",
        },
        {
          name: "TypeScript",
          level: 80,
          categoryId: catFrontend.id,
          order: 1,
          icon: "SiTypescript",
        },
        {
          name: "Next.js",
          level: 75,
          categoryId: catFrontend.id,
          order: 2,
          icon: "SiNextdotjs",
        },
        {
          name: "Node.js",
          level: 80,
          categoryId: catBackend.id,
          order: 0,
          icon: "FaNode",
        },
        {
          name: "Express",
          level: 75,
          categoryId: catBackend.id,
          order: 1,
          icon: "SiExpress",
        },
        {
          name: "Prisma",
          level: 70,
          categoryId: catBackend.id,
          order: 2,
          icon: "SiPrisma",
        },
        {
          name: "PostgreSQL",
          level: 70,
          categoryId: catBackend.id,
          order: 3,
          icon: "SiPostgresql",
        },
        {
          name: "Git",
          level: 85,
          categoryId: catTools.id,
          order: 0,
          icon: "FaGitAlt",
        },
        {
          name: "Docker",
          level: 70,
          categoryId: catTools.id,
          order: 1,
          icon: "FaDocker",
        },
      ],
    });
    console.log("✅ Skills seedés");
  }

  // --- Technologies ---
  const techData: { name: string; icon: string }[] = [
    { name: "Next.js", icon: "SiNextdotjs" },
    { name: "React", icon: "FaReact" },
    { name: "TypeScript", icon: "SiTypescript" },
    { name: "Express", icon: "SiExpress" },
    { name: "Prisma", icon: "SiPrisma" },
    { name: "PostgreSQL", icon: "SiPostgresql" },
    { name: "Node.js", icon: "FaNode" },
  ];
  const techMap: Record<string, { id: string }> = {};
  for (let i = 0; i < techData.length; i++) {
    const { name, icon } = techData[i];
    const tech = await prisma.technology.upsert({
      where: { name },
      update: {},
      create: { name, icon, category: "Frontend", order: i },
    });
    techMap[name] = { id: tech.id };
  }
  console.log("✅ Technologies seedées");

  // --- Project ---
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    const projectTechIds = [
      "Next.js",
      "React",
      "TypeScript",
      "Express",
      "Prisma",
      "PostgreSQL",
    ].map((n) => techMap[n].id);
    const project = await prisma.project.create({
      data: {
        slug: "portfolio-gagnaire",
        title: "Portfolio Gagnaire",
        description: "Portfolio personnel moderne avec Next.js et API Express.",
        longDescription:
          "Application fullstack mettant en avant mes compétences en développement web. Frontend Next.js, backend Express, base PostgreSQL avec Prisma.",
        technologies: { connect: projectTechIds.map((id) => ({ id })) },
        category: "Application web",
        github: "https://github.com/Metalzoid/gagnaire_portfolio",
        demo: "https://florian-gagnaire.dev",
        featured: true,
        date: "2025-02",
        order: 0,
      },
    });
    await prisma.projectImage.create({
      data: {
        projectId: project.id,
        path: "/images/projects/portfolio-1.jpg",
        order: 0,
      },
    });
    console.log("✅ Projet seedé : Portfolio Gagnaire");
  }

  // --- Experience ---
  const expCount = await prisma.experience.count();
  if (expCount === 0) {
    const expTechIds = ["React", "Node.js", "TypeScript"].map(
      (n) => techMap[n].id,
    );
    await prisma.experience.create({
      data: {
        type: "Alternance",
        title: "Développeur Web Fullstack",
        company: "Entreprise",
        location: "Lyon",
        startDate: "2024-09",
        current: true,
        description: "Développement d'applications web modernes.",
        technologies: { connect: expTechIds.map((id) => ({ id })) },
        order: 0,
      },
    });
    console.log("✅ Expérience seedée");
  }

  // --- Testimonial ---
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.create({
      data: {
        name: "Mentor",
        role: "Lead Developer",
        company: "OpenClassrooms",
        quote:
          "Florian fait preuve d'une grande rigueur et d'un excellent esprit d'apprentissage.",
        photo: "/images/testimonials/default.svg",
        order: 0,
      },
    });
    console.log("✅ Témoignage seedé");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
