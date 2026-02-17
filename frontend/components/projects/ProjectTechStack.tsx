import { Tag } from "@/components/ui/tag";
import { TechIcon } from "@/utils/technologyIcon";

type TechItem = string | { id: string; name: string; icon?: string | null };

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
        const icon =
          typeof tech === "object" && tech.icon ? (
            <TechIcon icon={tech.icon} name={tech.name} size={16} />
          ) : undefined;
        return <Tag key={key} label={label} variant="tech" icon={icon} />;
      })}
    </div>
  );
}
