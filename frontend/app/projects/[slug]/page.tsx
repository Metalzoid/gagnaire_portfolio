import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjects, getProjectBySlug, getProfile } from "@/services/api";
import { ProjectDetail } from "@/components/projects";
import { BreadcrumbSchema, ProjectSchema } from "@/components/seo";
import { Container } from "@/components/ui/container";
import { SITE_URL } from "@/lib/site-config";
import styles from "../projects.module.scss";

/** Force le rendu dynamique : compatible avec cookies() du root layout. */
export const dynamic = "force-dynamic";

// --------------------------------------------------------------------------
// SEO par projet
// --------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projet non trouvé" };

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `${SITE_URL}/projects/${project.slug}`,
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
  const [project, projects, profile] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getProfile(),
  ]);

  if (!project) notFound();

  const index = projects?.findIndex((p) => p.slug === slug) ?? -1;
  const prevSlug = index > 0 && projects ? projects[index - 1]?.slug ?? null : null;
  const nextSlug =
    index >= 0 && projects && index < projects.length - 1
      ? projects[index + 1]?.slug ?? null
      : null;

  return (
    <div className={`page page--project-detail ${styles.page}`}>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", href: "/" },
          { name: "Projets", href: "/projects" },
          { name: project.title },
        ]}
      />
      {profile.firstName && (
        <ProjectSchema project={project} profile={profile} />
      )}
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
