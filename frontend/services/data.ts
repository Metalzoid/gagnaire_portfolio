// ==========================================================================
// Service données - Couche d'abstraction pour charger les données JSON
// Sera converti en fetch() async lors de la Phase 5 (API backend)
// ==========================================================================
import type {
  Project,
  SkillCategory,
  Experience,
  Profile,
  Testimonial,
  PitchBlock,
  AboutValue,
} from "@/types";
import profileData from "@/data/profile.json";
import projectsData from "@/data/projects.json";
import topProjectsSlugs from "@/data/top-projects.json";
import skillsData from "@/data/skills.json";
import experienceData from "@/data/experience.json";
import testimonialsData from "@/data/testimonials.json";
import pitchData from "@/data/pitch.json";
import valuesData from "@/data/values.json";

const allProjects = projectsData as unknown as Project[];

// --------------------------------------------------------------------------
// Projects - TopProjects (page d'accueil) / allProjects (page projets)
// --------------------------------------------------------------------------
export function getTopProjects(): Project[] {
  const slugs = topProjectsSlugs as unknown as string[];
  return slugs
    .map((slug) => allProjects.find((p) => p.slug === slug))
    .filter((p): p is Project => p !== undefined);
}

export function getProjects(): Project[] {
  return allProjects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

// --------------------------------------------------------------------------
// Skills
// --------------------------------------------------------------------------
export function getSkills(): SkillCategory[] {
  return (skillsData as { categories: SkillCategory[] }).categories;
}

// --------------------------------------------------------------------------
// Experience
// --------------------------------------------------------------------------
export function getExperience(): Experience[] {
  const data = experienceData as Experience[];
  return [...data].sort((a, b) => {
    const dateA = a.startDate;
    const dateB = b.startDate;
    return dateB.localeCompare(dateA);
  });
}

// --------------------------------------------------------------------------
// Profile
// --------------------------------------------------------------------------
export function getProfile(): Profile {
  return profileData as Profile;
}

// --------------------------------------------------------------------------
// Testimonials
// --------------------------------------------------------------------------
export function getTestimonials(): Testimonial[] {
  return testimonialsData as Testimonial[];
}

// --------------------------------------------------------------------------
// About - Pitch & Values
// --------------------------------------------------------------------------
export function getPitchBlocks(): PitchBlock[] {
  return pitchData as PitchBlock[];
}

export function getValues(): AboutValue[] {
  return valuesData as AboutValue[];
}
