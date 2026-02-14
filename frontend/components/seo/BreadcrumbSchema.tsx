import { JsonLd } from "./JsonLd";
import { SITE_URL } from "@/lib/site-config";

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    name: item.name,
    ...(item.href && { item: `${SITE_URL}${item.href}` }),
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return <JsonLd data={schema} />;
}
