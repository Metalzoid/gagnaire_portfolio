import { Tag } from "@/components/ui/tag";

type TechItem = string | { id: string; name: string };

interface ProjectTechStackProps {
  technologies: TechItem[];
}

export function ProjectTechStack({ technologies }: ProjectTechStackProps) {
  if (!technologies?.length) return null;

  return (
    <div className="tech-stack" role="list">
      {technologies.map((tech) => {
        const label = typeof tech === "string" ? tech : tech.name;
        const key = typeof tech === "string" ? tech : tech.id;
        return <Tag key={key} label={label} variant="tech" />;
      })}
    </div>
  );
}
