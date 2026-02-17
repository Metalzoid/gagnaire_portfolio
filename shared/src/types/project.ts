// --------------------------------------------------------------------------
// Project
// --------------------------------------------------------------------------
export interface ProjectImage {
  id: string;
  path: string;
  order: number;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: {
    id: string;
    name: string;
    icon?: string | null;
    category?: string | null;
  }[];
  category: string;
  images: ProjectImage[];
  github?: string | null;
  demo?: string | null;
  featured: boolean;
  date: string;
}
