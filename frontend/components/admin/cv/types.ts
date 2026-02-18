import type { Profile, Experience, SkillCategory, Project } from "shared";

export interface CVItem<T> {
  id: string;
  visible: boolean;
  data: T;
}

export interface CVData {
  profile: Profile;
  experience: CVItem<Experience>[];
  skills: SkillCategory[];
  projects: CVItem<Project>[];
}
