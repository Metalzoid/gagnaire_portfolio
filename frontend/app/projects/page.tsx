import { ProjectsContent } from "@/components/projects";
import { BreadcrumbSchema } from "@/components/seo";
import { getProjects } from "@/services/api";

export const metadata = {
  title: "Projets",
  description:
    "Une sélection de mes réalisations, de l'intégration au fullstack.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", href: "/" },
          { name: "Projets", href: "/projects" },
        ]}
      />
      <ProjectsContent projects={projects} />
    </>
  );
}
