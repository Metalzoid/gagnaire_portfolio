import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjects, getProjectBySlug } from "@/services/data";
import { ProjectDetail } from "@/components/projects";
import { Container } from "@/components/ui/container";
import styles from "../projects.module.scss";

// --------------------------------------------------------------------------
// SSG - Génère les pages pour tous les slugs
// --------------------------------------------------------------------------
export function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

// --------------------------------------------------------------------------
// SEO par projet
// --------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Projet non trouvé" };

  return {
    title: `${project.title} - Gagnaire Florian`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.images?.main ? [project.images.main] : undefined,
    },
  };
}

// --------------------------------------------------------------------------
// Page
// --------------------------------------------------------------------------
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const projects = getProjects();
  const index = projects.findIndex((p) => p.slug === slug);
  const prevSlug = index > 0 ? projects[index - 1].slug : null;
  const nextSlug =
    index >= 0 && index < projects.length - 1 ? projects[index + 1].slug : null;

  return (
    <div className={`page page--project-detail ${styles.page}`}>
      <Container>
        <ProjectDetail
          project={project}
          prevSlug={prevSlug}
          nextSlug={nextSlug}
        />
      </Container>
    </div>
  );
}
