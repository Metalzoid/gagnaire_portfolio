import type { Metadata } from "next";
import { getProjects } from "@/services/data";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo";

export const metadata: Metadata = {
  title: "Projets",
  description: "Portfolio de projets web : applications React, Node.js, intégrations.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = getProjects();

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
