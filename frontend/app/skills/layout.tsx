import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo";

export const metadata: Metadata = {
  title: "Compétences",
  description:
    "Stack technique et technologies maîtrisées : React, Node.js, TypeScript, Next.js.",
};

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Accueil", href: "/" },
          { name: "Compétences", href: "/skills" },
        ]}
      />
      {children}
    </>
  );
}
