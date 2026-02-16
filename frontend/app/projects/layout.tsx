import type { Metadata } from "next";
import { getProjects } from "@/services/api";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo";

export const metadata: Metadata = {
  title: "Projets",
  description: "Portfolio de projets web : applications React, Node.js, intégrations.",
};

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  try {
    projects = await getProjects();
  } catch {
    // API injoignable, layout sans ItemListSchema projets
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", href: "/" },
          { name: "Projets", href: "/projects" },
        ]}
      />
      <ItemListSchema projects={projects} />
      {children}
    </>
  );
}
