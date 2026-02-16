import { SkillsContent } from "@/components/skills";
import { getSkills } from "@/services/api";

export const metadata = {
  title: "Compétences",
  description:
    "Technologies, outils et soft skills que j'utilise et développe au quotidien.",
};

export default async function SkillsPage() {
  const skills = await getSkills();

  return <SkillsContent skills={skills} />;
}
