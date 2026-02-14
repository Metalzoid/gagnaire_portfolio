import { JsonLd } from "./JsonLd";
import type { Project } from "@/types";
import { SITE_URL } from "@/lib/site-config";

interface ItemListSchemaProps {
  projects: Project[];
  name?: string;
}

export function ItemListSchema({
  projects,
  name = "Projets",
}: ItemListSchemaProps) {
  const itemListElement = projects.map((project, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    url: `${SITE_URL}/projects/${project.slug}`,
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement,
  };

  return <JsonLd data={schema} />;
}
