// ==========================================================================
// Types Phase 2 - Entités du portfolio
// ==========================================================================

// --------------------------------------------------------------------------
// Profile
// --------------------------------------------------------------------------
export interface Profile {
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  bio: string;
  pitch: {
    who: string;
    what: string;
    why: string;
    method: string;
  };
  photo: string;
  social: {
    github: string;
    linkedin: string;
    email: string;
  };
  cv: string;
}

// --------------------------------------------------------------------------
// Project
// --------------------------------------------------------------------------
export interface ProjectImages {
  main: string;
  thumbnails: string[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: string;
  images: ProjectImages;
  github?: string | null;
  demo?: string | null;
  featured: boolean;
  date: string;
}

// --------------------------------------------------------------------------
// Skills
// --------------------------------------------------------------------------
export interface Skill {
  name: string;
  level: number;
  icon?: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

// --------------------------------------------------------------------------
// Experience
// --------------------------------------------------------------------------
export interface Experience {
  type: "work" | "education";
  title: string;
  company?: string;
  location?: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  technologies?: string[];
}

// --------------------------------------------------------------------------
// Testimonial
// --------------------------------------------------------------------------
export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  photo: string;
}
