import { Tag } from "@/components/ui/tag";

interface ProjectTechStackProps {
  technologies: string[];
}

export function ProjectTechStack({ technologies }: ProjectTechStackProps) {
  if (!technologies?.length) return null;

  return (
    <div className="tech-stack" role="list">
      {technologies.map((tech) => (
        <Tag key={tech} label={tech} variant="tech" />
      ))}
    </div>
  );
}
